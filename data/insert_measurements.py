import requests
import urllib.request
import random
import json
import pytz
from datetime import datetime
import time

json_file = 'measurements.json'
base_url = "http://localhost:6969/api/"

spaces_url = base_url + "spaces"
measurements_url = base_url + "measurements"


def post(payload, url):
    headers = {"Content-Type": "application/json"}

    response = requests.request("POST", url, json=payload, headers=headers)
    print(response.text)


def new_val(val: float, max_change):
    return abs(val + random.uniform(-1, 1) * val * max_change)


def get_noise():
    num: int = random.randint(1, 3)
    if num is 1:
        return "high"
    elif num is 2:
        return "mid"
    else:
        return "low"


with urllib.request.urlopen(spaces_url) as url:
    data = json.load(url)

    for space in data:
        if len(space['measurements']) == 0:
            now = int(time.time())

            tz = pytz.timezone('Europe/Zurich')

            for i in range(10):
                now -= 5 * 60
                ts = datetime.fromtimestamp(now, tz).isoformat()
                payload = {"data": {
                    "temperature": new_val(25.84, 0.2),
                    "humidity": new_val(43.14, 0.3),
                    "pressure": new_val(1012.41, 0.1),
                    "light": new_val(470.43, 0.2),
                    "oxidised": new_val(2.36, 0.3),
                    "reduced": new_val(-1.06085, 0.3),
                    "nh3": new_val(0.103, 0.1),
                    "pm1": new_val(2.61, 0.1),
                    "pm25": new_val(9.72, 0.1),
                    "pm10": new_val(16.47, 0.1),
                    "noise": get_noise(),
                    "timestamp": ts,
                    "space": space['id']
                }}

                post(payload, measurements_url)
