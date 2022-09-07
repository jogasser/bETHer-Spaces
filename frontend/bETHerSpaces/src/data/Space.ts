import {LatLngExpression} from "leaflet";

export interface Space {
  id: number
  name: string
  rating: number | undefined
  seats: number
  measurements?: EnvironmentalData;
  polygon: LatLngExpression[]
}

export interface EnvironmentalData{
  temperature: number;
  noise: number;
}
