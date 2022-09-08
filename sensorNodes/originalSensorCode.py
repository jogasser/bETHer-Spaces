#Adapted from several sources including official Enviro+ source code, SPS30 source code

import time
import math
from time import sleep
import datetime
import csv
import os

try:
        from smbus2 import SMBus
except ImportError:
        from smbus import SMBus

import colorsys
import sys
import ST7735
try:
    # Transitional fix for breaking change in LTR559
    from ltr559 import LTR559
    ltr559 = LTR559()
except ImportError:
    import ltr559

import pandas as pd
from bme280 import BME280
from enviroplus import gas
from subprocess import PIPE, Popen
from sps30 import SPS30
from PIL import Image
from PIL import ImageDraw
from PIL import ImageFont
from fonts.ttf import RobotoMedium as UserFont
import logging

import ST7735
from urllib.request import urlopen

myAPI = '' #add your Thingspeak API key here
baseURL = 'https://api.thingspeak.com/update?api_key=%s' % myAPI


bus = SMBus(1)
bme280 = BME280(i2c_dev=bus)

sps = SPS30(1)

seconds = 0

# Create ST7735 LCD display class
st7735 = ST7735.ST7735(
    port=0,
    cs=1,
    dc=9,
    backlight=12,
    rotation=90,
    spi_speed_hz=10000000
)

# Initialize display
st7735.begin()

WIDTH = st7735.width
HEIGHT = st7735.height

# Set up canvas and font
img = Image.new('RGB', (WIDTH, HEIGHT), color=(0, 0, 0))
draw = ImageDraw.Draw(img)
font_size_small = 10
font_size_large = 20
font = ImageFont.truetype(UserFont, font_size_large)
smallfont = ImageFont.truetype(UserFont, font_size_small)
x_offset = 2
y_offset = 2

message = ""

# The position of the top bar
top_pos = 25
# Create a values dict to store the data
variables = ["temperature",
             "pressure",
             "humidity",
             "light",
             "oxidised",
             "reduced",
             "nh3",
             "pm1",
             "pm25",
             "pm10"]

units = ["C",
         "hPa",
         "%",
         "Lux",
         "ppm",
         "ppm",
         "ppm",
         "ug/m3",
         "ug/m3",
         "ug/m3"]
limits = [[4, 18, 28, 35],
         [250, 950, 1015, 1080],
         [20, 30, 60, 70],
         [-1, -1, 30000, 100000],
         [0.1, 0.3, 0.65, 1.24 ],
         [4.4, 9.4, 15.4, 30.4],
         [200, 400, 1200, 2000],
         [-1, -1, 50, 100],
         [-1, -1, 50, 100],
         [-1, -1, 50, 100]]

# RGB palette for values on the combined screen
palette = [(0, 0, 255),           # Dangerously Low
          (0, 255, 255),         # Low
          (0, 255, 0),           # Normal
          (255, 255, 0),         # High
          (255, 0, 0)]           # Dangerously High
values = {}

def get_cpu_temperature() -> float:
    """
    Gets CPU temperature
    :return: Float CPU temperature value
    """
    process = Popen(['vcgencmd', 'measure_temp'], stdout=PIPE, universal_newlines=True)
    output, _error = process.communicate()
    return float(output[output.index('=') + 1:output.rindex("'")])

def get_compensated_temperature() -> float:
    """
    Temporary method compensating heat from CPU
    :return: Float compensated temperature value
    """
    comp_factor = 2.0
    cpu_temp = get_cpu_temperature()
    raw_temp = bme280.get_temperature()
    comp_temp = raw_temp - ((cpu_temp - raw_temp) / comp_factor)
    comp_temp_adjusted = comp_temp - 2
    return comp_temp_adjusted



def save_data(idx, data):
    variable = variables[idx]
    # Maintain length of list
    values[variable] = values[variable][1:] + [data]
    unit = units[idx]
    message = "{}: {:.1f} {}".format(variable[:4], data, unit)

# Displays all the text on the LCD
def display_everything():
    draw.rectangle((0, 0, WIDTH, HEIGHT), (0, 0, 0))
    column_count = 2
    row_count = (len(variables) / column_count)
    for i in range(len(variables)):
        variable = variables[i]
        data_value = values[variable][-1]
        unit = units[i]
        x = x_offset + ((WIDTH // column_count) * (i // row_count))
        y = y_offset + ((HEIGHT / row_count) * (i % row_count))
        message = "{}: {:.1f} {}".format(variable[:4], data_value, unit)
        lim = limits[i]
        rgb = palette[0]
        for j in range(len(lim)):
            if data_value > lim[j]:
                rgb = palette[j + 1]
        draw.text((x, y), message, font=smallfont, fill=rgb)
    st7735.display(img)


# Cycle the sensors once to stabalise readings
#cpu_temp = get_cpu_temperature()
#cpu_temps = [get_cpu_temperature()] * 5
#factor = 2.25

# Smooth out with some averaging to decrease jitter
#cpu_temps = cpu_temps[1:] + [cpu_temp]
#avg_cpu_temp = sum(cpu_temps) / float(len(cpu_temps))
#raw_temp = bme280.get_temperature()
#comp_temp = raw_temp - ((avg_cpu_temp - raw_temp) / factor)# Pressures
press_reading = bme280.get_pressure()

# Humidity
humid = bme280.get_humidity()

# Light meter
light_reading = ltr559.get_lux()

for v in variables:
        values[v] = [1] * WIDTH

# Gas Sensor
red_r0 = 200000
ox_r0 = 20000
nh3_r0 = 750000

gas_data = gas.read_all()
red_in_ppm = math.pow(10, -1.25 * math.log10(gas_data.reducing/red_r0) + 0.64)
ox_in_ppm = math.pow(10, math.log10(gas_data.oxidising/ox_r0) - 0.8129)
nh3_in_ppm = math.pow(10, -1.8 * math.log10(gas_data.nh3/nh3_r0) - 0.163)


# PM sensor
if sps.read_article_code() == sps.ARTICLE_CODE_ERROR:
    raise Exception("ARTICLE CODE CRC ERROR!")
else:
    print("ARTICLE CODE: " + str(sps.read_article_code()))

if sps.read_device_serial() == sps.SERIAL_NUMBER_ERROR:
    raise Exception("SERIAL NUMBER CRC ERROR!")
else:
    print("DEVICE SERIAL: " + str(sps.read_device_serial()))

sps.set_auto_cleaning_interval(seconds) # default 604800, set 0 to disable auto-cleaning

sps.device_reset() # device has to be powered-down or reset to check new auto-cleaning interval

if sps.read_auto_cleaning_interval() == sps.AUTO_CLN_INTERVAL_ERROR: # or returns the interval in seconds
    raise Exception("AUTO-CLEANING INTERVAL CRC ERROR!")
else:
    print("AUTO-CLEANING INTERVAL: " + str(sps.read_auto_cleaning_interval()))

sleep(3)
sps.start_measurement()
sleep(3)

while not sps.read_data_ready_flag():
    sleep(0.25)
    if sps.read_data_ready_flag() == sps.DATA_READY_FLAG_ERROR:
        raise Exception("DATA-READY FLAG CRC ERROR!")

if sps.read_measured_values() == sps.MEASURED_VALUES_ERROR:
    raise Exception("MEASURED VALUES CRC ERROR!")
else:
    #print ("PM1.0 Value in µg/m3: " + str(sps.dict_values['pm1p0']))
    print ("PM2.5 Value in µg/m3: " + str(sps.dict_values['pm2p5']))

sps.stop_measurement()
sps.start_fan_cleaning()

def get_temp():
    temp = str(comp_temp)
    return(temp)

def get_hum():
    """Get humidity from the weather sensor"""
    humidity = bme280.get_humidity()
    hum = humidity + 14.5
    return(hum)

def get_pm1():
    variable = "pm1"
    unit = "ug/m3"
    data = sps.dict_values['pm1p0']
    data = round((data),2)
    return(data)

def get_pm25():
    variable = "pm25"
    unit = "ug/m3"
    data = sps.dict_values['pm2p5']
    data = round((data),2)
    return(data)

def get_pm10():
    variable = "pm10"
    unit = "ug/m3"
    data = sps.dict_values['pm10p0']
    data = round((data),2)
    return(data)


def time_now():
    now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    now = str(now)
    return(now)

def write_to_csv():
            # the a is for append, if w for write is used then it overwrites the file
    with open('/home/pi/new_readings.csv', 'a') as readings:
        values = pd.DataFrame([[time_now(), get_compensated_temperature(), get_hum(), get_pm1(), get_pm25(), get_pm10(), red_in_ppm, ox_in_ppm, nh3_in_ppm]], columns=[ 'Time', 'Temperature', 'Humidity', 'PM1', 'PM2.5', 'PM10', 'CO', 'NO2', 'NH3'])
        write_to_log = values.to_csv('new_readings.csv', mode='a', index=False, sep=',', header=True)
        return(write_to_log)

write_to_csv()

# Process data for Display
save_data(0, get_compensated_temperature())
save_data(1, press_reading)
save_data(2, get_hum())
save_data(3, light_reading)
save_data(4, ox_in_ppm)
save_data(5, red_in_ppm)
save_data(6, nh3_in_ppm)
save_data(7, get_pm1())
save_data(8, get_pm25())
save_data(9, get_pm10())

display_everything()

f = urlopen(baseURL + '&field1=%s&field2=%s&field3=%s&field4=%s&field5=%s&field6=%s&field7=%s&field8=%s' % (get_compensated_temperature(), get_hum(), get_pm1(), get_pm25(), get_pm10(), ox_in_ppm, red_in_ppm, nh3_in_ppm))
f.read()
f.close()
