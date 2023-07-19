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

  async create() {
    this.layers = [];
    this.createLayers();
  }

  append(pointOrPoints: Point | Point[]) {
    const points = Array.isArray(pointOrPoints)
      ? pointOrPoints
      : [pointOrPoints];

    for (const point of points) {
      this.appendPoint(point);
    }
  }

  createLayers() {
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

  get levelToAppend() {
    let baseProbability = Math.random();

    for (const layer of this.layers) {
      if (baseProbability < layer.probability) {
        return layer.level;
      }

      baseProbability -= layer.probability;
    }

    return this.layers.length - 1;
  }

  private appendPoint(point: Point) {
    const existingPoint = this.points[point.id];

    if (existingPoint) {
      return existingPoint;
    }

    const targetLevel = this.levelToAppend;

    for (const layer of this.layers) {
      if (layer.level > targetLevel) break;

      layer.points.push(point);
    }
  }

  get layerStats() {
    return this.layers.map((layer) => layer.stats);
  }

  //   async build() {}
}

export { Layer };
