import {Measurements} from "../data/Measurement";

export interface ChartProps {
  measurements: Measurements[];
}

export function formatDate(date: Date) {
  const copy = new Date(date);
  const hours = copy.getHours() > 9 ? copy.getHours() : `0${copy.getHours()}`;
  const minutes = copy.getMinutes() > 9 ? copy.getMinutes() : `0${copy.getMinutes()}`;
  return hours + ':' + minutes;
}

export function sortMeasurement(data: Measurements[]) {
  return data.sort((a, b) => {
    return a.timestamp > b.timestamp ? 1 : a.timestamp < b.timestamp ? -1 : 0
  })
}