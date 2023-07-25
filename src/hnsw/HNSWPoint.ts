import { BasePoint } from "../BasePoint";

import { Layer } from "./Layer";

export class HNSWPoint {
  static get BasePoint() {
    return BasePoint;
  }

  layer: Layer;
  point: BasePoint;
  nnPerLayer: Array<Record<string, number>> = [];

  constructor(point: BasePoint, layer: Layer) {
    this.point = point;
    this.layer = layer;
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

  get getVertexPeer() {
    return this.point.getVertexPeer;
  }
}
