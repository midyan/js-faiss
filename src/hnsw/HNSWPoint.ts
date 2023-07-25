import { BasePoint } from "../BasePoint";
import type { HNSW } from "./HNSW";

export class HNSWPoint {
  static get BasePoint() {
    return BasePoint;
  }

  point: BasePoint;
  maxLayerNumber: number;
  nnPerLayer: Array<Record<string, number>> = [];

  constructor(point: BasePoint, maxLayerNumber: number) {
    this.point = point;
    this.maxLayerNumber = maxLayerNumber;
  }

  index(store: HNSW) {
    if (!store) {
      console.log("beep");
    }

    // Reset Before Indexing
    this.nnPerLayer = [];

    for (let i = 0; i <= this.maxLayerNumber; i++) {
      const layer = store.layers[i];

      this.nnPerLayer[i] = Object.fromEntries(
        Object.entries(store.edgesPerLayer[i])
          .filter(([edge]) => edge.includes(this.id))
          .slice(0, layer.NN)
          .map(([edge, dist]) => [this.point.getVertexPeer(edge), dist]),
      );
    }

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

  get getVertexPeer() {
    return this.point.getVertexPeer;
  }
}
