import { v4 as uuid } from "uuid";

import { geometry } from "./utils";

export class BasePointDTO {
  id: string;
  embeddings: number[];

  constructor(embeddings: number[], id?: string) {
    this.id = id ?? uuid();
    this.embeddings = embeddings;
  }
}

export class BasePoint implements BasePointDTO {
  id: string;
  embeddings: number[];

  static normalizeEmbeddings(embeddings: number[]) {
    const distToOrigin = geometry.getEuclideanDistance(embeddings, [0, 0, 0]);

    return embeddings.map((coordinate) => coordinate / distToOrigin);
  }

  constructor(embeddings: number[], id?: string) {
    this.id = id ?? uuid();

    const embeddingsAreAllZeros = embeddings.every(
      (coordinate) => coordinate === 0,
    );

    if (embeddingsAreAllZeros) {
      throw new Error("Embeddings cannot be all zeros");
    }

    this.embeddings = BasePoint.normalizeEmbeddings(embeddings);
  }

  getDistance(targetPoint: BasePoint) {
    const highestDimensionality = Math.max(
      this.embeddings.length,
      targetPoint.embeddings.length,
    );

    const currentPointCoordinates =
      geometry.getNormalizedEmbeddingByDimensionNumber(
        this.embeddings,
        highestDimensionality,
      );

    const queryCoordinate = geometry.getNormalizedEmbeddingByDimensionNumber(
      targetPoint.embeddings,
      highestDimensionality,
    );

    return geometry.getEuclideanDistance(
      currentPointCoordinates,
      queryCoordinate,
    );
  }

  getVertex(targetPoint: BasePoint) {
    return [this.id, targetPoint.id].sort().join("_");
  }

  getVertexPeer(vertex: string) {
    return vertex.split("_").filter((id) => id !== this.id)[0];
  }
}
