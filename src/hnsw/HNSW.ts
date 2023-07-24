import { Store } from "../Store";
import { Layer } from "./Layer";
import { HNSWPoint } from "./HNSWPoint";
// import type { BasePoint } from "../BasePoint";

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
      const layer = new Layer(this.layers.length, {
        baseNN: this.settings.baseNN,
      });

      if (layer.assignPropability < this.settings.probabilityThreshold) {
        break;
      }

      this.layers.push(layer);
    }
  }

  get entryLayer(): Layer | null {
    return this.layers.find((layer) => layer.points.length > 0) ?? null;
  }

  // add(
  //   input: number[] | number[][] | HNSWPoint | HNSWPoint[],
  //   overwrite?: boolean,
  // ): any {
  //   let pointsOrEmbeddings: HNSWPoint[] | number[][];

  //   if (!Array.isArray(input)) {
  //     pointsOrEmbeddings = [input];
  //   } else if (isArrayofNumbers(input)) {
  //     pointsOrEmbeddings = [input];
  //   } else {
  //     pointsOrEmbeddings = input;
  //   }

  //   const addedPoints: HNSWPoint[] = [];

  //   for (const pointOrEmbedding of pointsOrEmbeddings) {
  //     let basePoint: BasePoint;

  //     if (isArrayofNumbers(pointOrEmbedding)) {
  //       basePoint = this.addBasePoint(pointOrEmbedding, overwrite);
  //     } else {
  //       basePoint = this.addBasePoint(pointOrEmbedding, overwrite);
  //     }

  //     const point = this.addPoint(basePoint, overwrite);
  //   }

  //   // if (Array.isArray(input)) {
  //   //   return this.addMultiple(input, overwrite);
  //   // }

  //   // return this.addSingle(input, overwrite);
  // }

  // private addPoint(point: BasePoint, overwrite?: boolean): HNSWPoint {
  //   if (this.points[point.id] && !overwrite) {
  //     return this.points[point.id];
  //   }

  //   const layerToAppend = this.getLayerToAppend();
  //   //
  //   const hnswPoint = new HNSWPoint(
  //     point.embeddings,
  //     this.layers.length,
  //     point.id,
  //   );

  //   this.points[point.id] = hnswPoint;

  //   return hnswPoint;
  // }

  // ---

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

// function isArrayofNumbers(value: any): value is number[] {
//   return (
//     Array.isArray(value) && value.every((item) => typeof item === "number")
//   );
// }
