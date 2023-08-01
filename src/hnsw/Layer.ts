import { BasePoint } from "../BasePoint";

import { HNSW } from "./HNSW";
import { HNSWPoint } from "./HNSWPoint";

export interface ILayerSettings {
  baseNN: number;
}

export class Layer {
  store: HNSW;
  settings: ILayerSettings;

  points: Record<string, HNSWPoint> = {};

  NN: number;
  level: number;
  assignPropability: number;

  constructor(level: number, layerSettings: ILayerSettings, store: HNSW) {
    this.level = level;
    this.store = store;

    this.settings = {
      ...layerSettings,
    };

    this.NN = this.settings.baseNN * (level + 2);
    this.assignPropability =
      Math.exp(-level / this.levelMultiplier) *
      (1 - Math.exp(-1 / this.levelMultiplier));
  }

  search(
    queryPoint: BasePoint,
    entryPoint: HNSWPoint,
    visitedPoints: Set<string>,
  ) {
    let currentPoint = entryPoint;

    let continueSerching = true;

    while (continueSerching) {
      let isLocalMinimum = true;

      const NNs = this.getNNOfPoint(currentPoint);

      for (const pointId of NNs) {
        if (visitedPoints.has(pointId)) {
          continue;
        }

        visitedPoints.add(pointId);

        const pointDistance =
          this.store.points[pointId].getDistance(queryPoint);

        // If the distance is smaller than the current point
        // we have found a new local minimum, so we continue searching from there
        if (pointDistance <= currentPoint.getDistance(queryPoint)) {
          isLocalMinimum = false;

          currentPoint = this.store.points[pointId];
        }
      }

      // If we have not found a new local minimum we can stop searching
      if (isLocalMinimum) {
        continueSerching = false;
      }
    }

    return currentPoint;
  }

  canAppendPoint() {
    return Math.random() < this.assignPropability;
  }

  getRandomPoint() {
    const points = Object.values(this.points);

    for (const point of points) {
      if (Math.random() < 0.5) {
        return point;
      }
    }

    return points[0];
  }

  // ---

  private getNNOfPoint(point: HNSWPoint) {
    return Object.values(this.points)
      .sort(
        (pointA, pointB) =>
          pointA.getDistance(point) - pointB.getDistance(point),
      )
      .slice(0, this.NN)
      .map((point) => point.id);
  }

  // ---

  get levelMultiplier() {
    return 1 / Math.log(this.settings.baseNN);
  }

  get stats() {
    return {
      NN: this.NN,
      level: this.level,
      settings: this.settings,
      assignPropability: this.assignPropability,
      points: Object.keys(this.points).length,
    };
  }
}
