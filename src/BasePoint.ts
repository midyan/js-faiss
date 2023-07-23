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

  constructor(embeddings: number[], id?: string) {
    this.id = id ?? uuid();
    this.embeddings = embeddings;
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
}
