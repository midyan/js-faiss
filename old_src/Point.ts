import { v4 as uuid } from "uuid";

export class PointDTO {
  id: string;
  embeddings: number[];

  constructor(embeddings: number[], id?: string) {
    this.id = id ?? uuid();
    this.embeddings = embeddings;
  }
}

export class Point implements PointDTO {
  id: string;
  embeddings: number[];
  maxLayerNumber: number;

  nnPerLayer: Array<Array<{ distance: number; point: Point }>> = [];

  constructor(embeddings: number[], maxLayerNumber: number, id?: string) {
    this.id = id ?? uuid();
    this.maxLayerNumber = maxLayerNumber;
    this.embeddings = embeddings;
  }

  getDistanceFrom(coordinate: number[]) {
    const highestDimensionality = Math.max(
      this.embeddings.length,
      coordinate.length,
    );

    const currentPointCoordinates = getNormalizedEmbeddingByDimensionNumber(
      this.embeddings,
      highestDimensionality,
    );

    const queryCoordinate = getNormalizedEmbeddingByDimensionNumber(
      coordinate,
      highestDimensionality,
    );

    return getEuclideanDistance(currentPointCoordinates, queryCoordinate);
  }

  // TODO Add it to a queue
  reindexUpToLayer(
    layerNumber: number,
    allPoints: Point[],
    nnPerLayer: number[],
  ) {
    const pointsToProcess = allPoints.filter(
      (point) => point.maxLayerNumber <= layerNumber && point.id !== this.id,
    );

    const vertexesAdded = new Set<string>();

    this.nnPerLayer = [];

    for (let i = 0; i <= layerNumber; i++) {
      const distanceMap: Record<string, { distance: number; point: Point }> =
        {};

      for (const point of pointsToProcess) {
        distanceMap[point.id] = distanceMap[point.id] || {
          distance: this.getDistanceFrom(point.embeddings),
          point,
        };
      }

      // TODO Optimize this
      this.nnPerLayer[i] = Object.entries(distanceMap)
        .sort(([, point1], [, point2]) => point1.distance - point2.distance)
        .map(([, point]) => point)
        .filter((point) => {
          const vertex = `${this.id}-${point.point.id}`;

          return !vertexesAdded.has(vertex);
        })
        .slice(0, nnPerLayer[i]);

      this.nnPerLayer[i].forEach((point) => {
        vertexesAdded.add(`${this.id}-${point.point.id}`);
      });
    }
  }

  // async calculateDistances(
  //   points: Point[],
  //   NN: number,
  //   vectorSpaceDimension: number,
  // ): Promise<void> {
  //   points.forEach((point) => {
  //     console.log(this.maxLayerNumber, point.maxLayerNumber);
  //   });

  //   // console.log("calculateDistances", points);

  //   // const currentPointCoordinates = getNormalizedEmbeddingByDimensionNumber(
  //   //   this.embeddings,
  //   //   vectorSpaceDimension,
  //   // );

  //   // const pointsCoordinates = points.map((point) =>
  //   //   getNormalizedEmbeddingByDimensionNumber(
  //   //     point.embeddings,
  //   //     vectorSpaceDimension,
  //   //   ),
  //   // );

  //   // const pointByIdMap = new Map<string, Point>();

  //   // for (let i = 0; i < points.length; i++) {
  //   //   const point = points[i];

  //   //   pointByIdMap.set(point.id, point);

  //   //   if (point.id === this.id) {
  //   //     continue;
  //   //   }

  //   //   if (typeof this.nnDistances[point.id] !== "undefined") {
  //   //     continue;
  //   //   }

  //   //   if (typeof point.nnDistances[this.id] !== "undefined") {
  //   //     this.nnDistances[point.id] = point.nnDistances[this.id];

  //   //     continue;
  //   //   }

  //   //   const coordinate = pointsCoordinates[i];

  //   //   const distance = getEuclideanDistance(
  //   //     currentPointCoordinates,
  //   //     coordinate,
  //   //   );

  //   //   this.nnDistances[point.id] = distance;
  //   //   point.nnDistances[this.id] = distance;
  //   // }

  //   // const sortedByDistance = Object.entries(this.nnDistances).sort(
  //   //   ([, distance1], [, distance2]) => distance1 - distance2,
  //   // );

  //   // let count = 0;
  //   // for (const [id] of sortedByDistance) {
  //   //   if (count >= NN) break;

  //   //   this.nns.push(pointByIdMap.get(id) as Point);

  //   //   count += 1;
  //   // }
  // }

  // async calculateDistances(
  //   point: Point,
  //   points: Point[],
  //   NN: number,
  // ): Promise<void> {}
}

export const getNormalizedEmbeddingByDimensionNumber = (
  embeddings: number[],
  dimensionNumber: number,
) => {
  if (embeddings.length > dimensionNumber) {
    return embeddings;
  }

  const diff = dimensionNumber - embeddings.length;

  return embeddings.concat(new Array(diff).fill(0));
};

export const getEuclideanDistance = (
  embeddings1: number[],
  embeddings2: number[],
) => {
  let sum = 0;

  for (let i = 0; i < embeddings1.length; i++) {
    const diff = embeddings1[i] - embeddings2[i];

    sum += diff ** 2;
  }

  return Math.sqrt(sum);
};
