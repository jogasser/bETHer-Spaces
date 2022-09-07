import {LatLngExpression} from "leaflet";

export interface Space {
  id: number
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
    id: 1,
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
  },
  {
    id: 2,
    name: 'Testspace 2',
    rating: 5,
    environmentalData: {
      temperature: 20,
      noise: 50,
    },
    polygon: [
      [47.3786, 8.5472],
      [47.3787, 8.5472],
      [47.3787, 8.5473],
      [47.3786, 8.5473]
    ]
  }
]

export default MockSpaces;