
export interface Space {
  id: number
  name: string
  rating?: number
  seats: number
  measurements?: Measurements[];
  polygons: { lat: number, lon: number}[]
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
  createdAt: Date;
}
