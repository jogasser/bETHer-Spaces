import {LatLngExpression} from "leaflet";

export interface Space {
  name: string
  rating: number
  environmentalData?: EnvironmentalData;
  polygon: LatLngExpression[]
}

export interface EnvironmentalData{
  temperature: number;
  noise: number;
}

const MockSpaces: Space[] = [
  {
    name: 'Testspace',
    rating: 3.5,
    environmentalData: {
      temperature: 20,
      noise: 50,
    },
    polygon: [
      [47.3766, 8.5482],
      [47.3767, 8.5482],
      [47.3767, 8.5483],
      [47.3766, 8.5483]
    ]
  }
]

export default MockSpaces;