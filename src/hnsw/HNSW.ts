import * as fastq from "fastq";

import { Store } from "../Store";
import { Point, PointDTO } from "../Point";

import { Layer } from "./Layer";

export class HNSW extends Store {
  layers: Layer[] = [];
  baseNN = 32;
  probabilityThreshold = 1e-9;
  vectorSpaceDimension = 0;

  calculatePointNNQueue: fastq.queueAsPromised<
    { point: Point; NN: number; points: Point[] },
    void
  >;
  private nnCalculateWorkerCount = 10;

  constructor() {
    super();

    this.calculatePointNNQueue = fastq.promise(
      this,
      this.calculatePointNN,
      this.nnCalculateWorkerCount,
    );
  }

  get levelMultiplier() {
    return 1 / Math.log(this.baseNN);
  }

  async create() {
    this.layers = [];
    this.createLayers();
  }

  append(pointOrPoints: PointDTO | PointDTO[]) {
    const points = Array.isArray(pointOrPoints)
      ? pointOrPoints
      : [pointOrPoints];

    let highestLayerInsertedTo = 0;

    for (const point of points) {
      const insertedPoint = this.appendPoint(point);

      if (insertedPoint.maxLayerNumber > highestLayerInsertedTo) {
        highestLayerInsertedTo = insertedPoint.maxLayerNumber;
      }
    }

    this.recalculateNNUpToLayer(highestLayerInsertedTo);
  }

  private recalculateNNUpToLayer(targetLayer: number) {
    for (const layer of this.layers) {
      if (layer.level > targetLayer) break;

      for (const point of layer.points) {
        point.resetNN();
      }

      for (const point of layer.points) {
        this.calculatePointNNInQueue(point, layer.points, layer.NN);
      }
    }
  }

  private calculatePointNNInQueue(point: Point, points: Point[], NN: number) {
    return this.calculatePointNNQueue.push({
      point,
      points,
      NN,
    });
  }

  private calculatePointNN({
    point,
    points,
    NN,
  }: {
    point: Point;
    points: Point[];
    NN: number;
  }): Promise<void> {
    return point.calculateDistances(points, NN, this.vectorSpaceDimension);
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

  get layerStats() {
    return this.layers.map((layer) => layer.stats);
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

  private appendPoint(pointDto: PointDTO) {
    const existingPoint = this.points[pointDto.id];

    if (existingPoint) {
      return existingPoint;
    }

    const targetLevel = this.levelToAppend;

    const point = new Point(pointDto.embeddings, targetLevel, pointDto.id);

    for (const layer of this.layers) {
      if (layer.level > targetLevel) break;

      layer.points.push(point);
    }

    if (point.embeddings.length > this.vectorSpaceDimension) {
      this.vectorSpaceDimension = point.embeddings.length;
    }

    return point;
  }
}

export { Layer };
