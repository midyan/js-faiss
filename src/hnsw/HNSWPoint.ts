import { BasePoint } from "../BasePoint";
// import type { HNSW } from "./HNSW";

export class HNSWPoint {
  static get BasePoint() {
    return BasePoint;
  }

  point: BasePoint;
  maxLayerNumber: number;
  nnPerLayer: Array<Array<{ distance: number; point: HNSWPoint }>> = [];

  constructor(point: BasePoint, maxLayerNumber: number) {
    this.point = point;
    this.maxLayerNumber = maxLayerNumber;
  }

  index(/* store: HNSW */) {
    return true;
  }

  // ---

  get id() {
    return this.point.id;
  }

  get embeddings() {
    return this.point.embeddings;
  }

  get getDistance() {
    return this.point.getDistance;
  }

  get getVertex() {
    return this.point.getVertex;
  }
}
