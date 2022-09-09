import {Measurements} from "./Measurement";

export interface Space {
  id: number
  name: string
  rating?: number
  seats: number
  measurements?: Measurements[];
  polygons: { lat: number, lon: number}[]
}
