import type { Point } from "./Point";

export class Store {
  points: { [key: string]: Point } = {};
}
