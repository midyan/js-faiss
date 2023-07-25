import { BasePoint } from "../BasePoint";
import type { HNSW } from "./HNSW";
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

  index(store: HNSW) {
    if (!store) {
      console.log("beep");
    }

    // Reset Before Indexing
    this.nnPerLayer = [];

    for (let i = 0; i <= this.layer.level; i++) {
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
