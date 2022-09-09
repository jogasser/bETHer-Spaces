import {Measurements} from "./Measurement";
import {Rating} from "./Rating";

export interface Space {
  id: number;
  name: string;
  ratings?: Rating[];
  rating?: number
  seats: number;
  measurements?: Measurements[];
  img: {
    url: string
  };
  polygons: { lat: number, lon: number }[];
}