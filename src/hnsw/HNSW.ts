import { Store } from "../Store";
import { Layer } from "./Layer";
import { HNSWPoint } from "./HNSWPoint";
import { BasePoint } from "../BasePoint";

export interface IHNSWSettings {
  baseNN: number;
  probabilityThreshold: number;
}

export class HNSW extends Store {
  static Point = HNSWPoint;
  static Layer = Layer;

  static defaultSettings: IHNSWSettings = {
    baseNN: 32,
    probabilityThreshold: 1e-9,
  };

  highestLayer = 0;

  points: Record<string, HNSWPoint> = {};
  layers: Layer[] = [];
  settings: IHNSWSettings;

  constructor(settings?: Partial<IHNSWSettings>) {
    super();

    this.settings = {
      ...HNSW.defaultSettings,
      ...(settings ?? {}),
    };

    const canContinue = true;
    while (canContinue) {
      const layer = new Layer(
        this.layers.length,
        {
          baseNN: this.settings.baseNN,
        },
        this,
      );

      if (layer.assignPropability < this.settings.probabilityThreshold) {
        break;
      }

      this.layers.push(layer);
    }
  }

  add(
    input: number[] | number[][] | HNSWPoint | HNSWPoint[],
    overwrite?: boolean,
  ): HNSWPoint[] {
    let pointsOrEmbeddings: HNSWPoint[] | number[][];

    if (!Array.isArray(input)) {
      pointsOrEmbeddings = [input];
    } else if (isArrayofNumbers(input)) {
      pointsOrEmbeddings = [input];
    } else {
      pointsOrEmbeddings = input;
    }

    const addedPoints: HNSWPoint[] = [];

    for (const pointOrEmbedding of pointsOrEmbeddings) {
      let basePoint: BasePoint;

      if (isArrayofNumbers(pointOrEmbedding)) {
        basePoint = this.addBasePoint(pointOrEmbedding, overwrite);
      } else {
        basePoint = this.addBasePoint(pointOrEmbedding, overwrite);
      }

      const point = this.addPoint(basePoint, overwrite);

      addedPoints.push(point);
    }

    return addedPoints;
  }

  getLayerToAppendPoint(): Layer {
    let baseProbability = Math.random();

    for (const layer of this.layers) {
      if (baseProbability < layer.assignPropability) {
        return layer;
      }

      baseProbability -= layer.assignPropability;
    }

    return this.layers[this.layers.length - 1];
  }

  private addPoint(point: BasePoint, overwrite?: boolean): HNSWPoint {
    if (this.points[point.id] && !overwrite) {
      return this.points[point.id];
    }

    const layerToAppend = this.getLayerToAppendPoint();

    if (layerToAppend.level > this.highestLayer) {
      this.highestLayer = layerToAppend.level;
    }

    const hnswPoint = new HNSWPoint(point, layerToAppend);

    this.points[point.id] = hnswPoint;

    return hnswPoint;
  }

  // ---

  get entryLayer(): Layer {
    let indexOfEntry =
      this.layers.findIndex((layer) => Object.keys(layer.points).length) - 1;

    if (indexOfEntry < 0) indexOfEntry = 0;

    return this.layers[indexOfEntry];
  }

  get Point() {
    return HNSW.Point;
  }

  get Layer() {
    return HNSW.Layer;
  }

  get layersStats() {
    return this.layers.map((layer) => layer.stats);
  }
}

function isArrayofNumbers(value: any): value is number[] {
  return (
    Array.isArray(value) && value.every((item) => typeof item === "number")
  );
}
