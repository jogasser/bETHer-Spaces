import {Measurements} from "./Measurement";

export interface Space {
  id: number;
  name: string;
  rating?: number;
  seats: number;
  measurements?: Measurements[];
  img: {
    url: string
  };
  polygons: { lat: number, lon: number }[];
}