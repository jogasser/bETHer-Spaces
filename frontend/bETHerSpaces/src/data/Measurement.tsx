import {MeasurementOptions} from "../context/OptionsContext";

type AvailableMeasurements = 'temperature' | 'humidity' | 'oxidised' | 'reduced' | 'nh3' | 'pm1' | 'pm25' | 'pm10';

export const RelevantMeasurements: AvailableMeasurements[] = ['temperature', 'humidity', 'oxidised', 'reduced', 'nh3', 'pm1', 'pm25', 'pm10']

export const MeasurementThresholds: Record<string, number> = {
  temperature: 2.5,
  humidity: 20,
  oxidised: 1,
  reduced: 1,
  nh3: 1,
  pm1: 2.5,
  pm25: 10,
  pm10: 15,
}

export const MeasurementTitles: Record<string, string> = {
  temperature: 'Temperature',
  humidity: 'Humidity',
  oxidised: 'Oxidised',
  reduced: 'Reduced',
  nh3: 'NH3 Level',
  pm1: 'PM1 Level',
  pm25: 'PM2.5 Level',
  pm10: 'PM10 Level',
}

export const MeasurementUnits: Record<string, string> = {
  temperature: '°C',
  humidity: '%',
  oxidised: 'ppm',
  reduced: 'ppm',
  nh3: 'ppm',
  pm1: 'ug/m3',
  pm25: 'ug/m3',
  pm10: 'ug/m3',
}

const statusColors: Record<string, string> = {
  'good': 'green',
  'warn': '#FFCC00',
  'bad': 'red'
}

export function getOverallStatusColor(measurements: Measurements, options: MeasurementOptions): string {
  let status = 0;

  RelevantMeasurements.forEach(m => {
    const newStatus = getStatus(measurements, options, m);
    if(newStatus > status) {
      status = newStatus;
    }
  })

  return getStatusColor(status);
}

export function getStatusColor(status: number ) {
  return status == 2 ? statusColors['bad'] : status == 1 ? statusColors['warn'] : statusColors['good'];
}

export function getStatus(measurement: Measurements, option: MeasurementOptions, type: AvailableMeasurements ) {
  if(type === 'temperature') {
    if(Math.abs(measurement[type] - option[type]) > MeasurementThresholds[type] * 2) {
      return 2;
    }
    if(Math.abs(measurement[type] - option[type]) > MeasurementThresholds[type]) {
      return 1;
    }
  } else {
    if(measurement[type] - option[type] > MeasurementThresholds[type] * 2) {
      return 2;
    }
    if(measurement[type] - option[type] > MeasurementThresholds[type]) {
      return 1;
    }
  }
  return 0;
}

export interface Measurements {
  temperature: number;
  pressure: number;
  humidity: number;
  light: number;
  oxidised: number;
  reduced: number;
  nh3: number;
  pm1: number;
  pm25: number;
  pm10: number;
  noise: 'high' | 'mid' | 'low';
  timestamp: Date;
}
