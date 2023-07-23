import type { BasePoint } from "./BasePoint";

export class Store {
  points: { [key: string]: BasePoint } = {};
}
