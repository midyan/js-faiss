import { Store } from "../Store";
import { Layer } from "./Layer";
import { HNSWPoint } from "./HNSWPoint";
import type { BasePoint } from "../BasePoint";

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

  edgesPerLayer: Array<Record<string, number>> = [];
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

        const point = this.addPoint(basePoint, overwrite);

        addedPoints.push(point);
      } else {
        basePoint = this.addBasePoint(pointOrEmbedding, overwrite);
      }
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

  // TODO Divide vector space into sections and only reindex affected sections
  index(layerNumber: number = this.entryLayer.level) {
    this.recalculateEdges(layerNumber);

    // TODO Make it parallel
    for (const pointId in this.points) {
      const point = this.points[pointId];

      point.index(this);

      break;
    }
  }

  private recalculateEdges(layerNumber: number) {
    // Needs to be here, so we avoid double calculation
    this.edgesPerLayer = [];

    // TODO Make in parallel
    // Calculates all unique edges per layer
    for (let i = 0; i <= layerNumber; i += 1) {
      if (!this.edgesPerLayer[i]) {
        this.edgesPerLayer[i] = {};
      }

      const currentVertexMap = this.edgesPerLayer[i];

      // Calculate edges
      // TODO Make it in parallel
      for (const originPointId in this.points) {
        const originPoint = this.points[originPointId];

        // If current layer is higher than max layer of point, skip
        if (originPoint.layer.level < i) continue;

        // TODO Make it in parallel
        for (const targetPointId in this.points) {
          // Don't process itself
          if (originPointId === targetPointId) continue;

          const targetPoint = this.points[targetPointId];

          const edge = originPoint.getVertex(targetPoint);

          currentVertexMap[edge] =
            currentVertexMap[edge] ?? originPoint.getDistance(targetPoint);
        }
      }
    }

    // Remove duplicated edge from lower layers
    for (let i = 0; i <= layerNumber; i += 1) {
      const revesedLayerNumber = layerNumber - i;

      const currentVertexMap = this.edgesPerLayer[revesedLayerNumber];

      for (const edge in currentVertexMap) {
        for (let j = 0; j < i; j += 1) {
          delete this.edgesPerLayer[j][edge];
        }
      }
    }
  }

  private addPoint(point: BasePoint, overwrite?: boolean): HNSWPoint {
    if (this.points[point.id] && !overwrite) {
      return this.points[point.id];
    }

    const layerToAppend = this.getLayerToAppendPoint();

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
