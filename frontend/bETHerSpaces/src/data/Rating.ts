import {Space} from "./Space";

export interface Rating {
  id: number;
  cleanness: number;
  accessibility: number;
  cosiness: number;
  comment: string;
  space?: Space;
}