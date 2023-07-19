import { Store } from "../Store";
import type { Point } from "../Point";

import { Layer } from "./Layer";

export class HNSW extends Store {
  layers: Layer[] = [];
  baseNN = 32;
  probabilityThreshold = 1e-9;

  get levelMultiplier() {
    return 1 / Math.log(this.baseNN);
  }

  async create(points: Point[]) {
    this.layers = [];
    this.points = points;

    // eslint-disable-next-line no-constant-condition
    while (true) {
      const layer = new Layer(
        this.layers.length,
        this.baseNN,
        this.levelMultiplier,
      );

      if (layer.probability < this.probabilityThreshold) {
        break;
      }

      this.layers.push(layer);
    }
  }

  //   async build() {}
}

export { Layer };
