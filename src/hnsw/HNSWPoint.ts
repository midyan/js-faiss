import { BasePoint } from "../BasePoint";

export class HNSWPoint extends BasePoint {
  maxLayerNumber: number;
  nnPerLayer: Array<Array<{ distance: number; point: HNSWPoint }>> = [];

  constructor(embeddings: number[], maxLayerNumber: number, id?: string) {
    super(embeddings, id);

    this.maxLayerNumber = maxLayerNumber;
  }

  reindexUpToLayer(
    layerNumber: number,
    allPoints: HNSWPoint[],
    nnPerLayer: number[],
  ) {
    const pointsToProcess = allPoints.filter(
      (point) => point.maxLayerNumber <= layerNumber && point.id !== this.id,
    );

    const vertexesAdded = new Set<string>();

    this.nnPerLayer = [];

    for (let i = 0; i <= layerNumber; i++) {
      const distanceMap: Record<
        string,
        { distance: number; point: HNSWPoint }
      > = {};

      for (const point of pointsToProcess) {
        distanceMap[point.id] = distanceMap[point.id] || {
          distance: this.getDistance(point),
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

      for (const point of this.nnPerLayer[i] ?? []) {
        vertexesAdded.add(`${this.id}-${point.point.id}`);
      }
    }
  }
}
