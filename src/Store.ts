import { BasePoint } from "./BasePoint";

export class Store {
  points: { [key: string]: BasePoint } = {};

  addPoint(embedding: number[]): BasePoint;
  addPoint(point: BasePoint, overwrite?: boolean): BasePoint;
  addPoint(input: number[] | BasePoint, overwrite?: boolean): BasePoint {
    if (input instanceof BasePoint) {
      return this.addSingleBasePoint(input, overwrite);
    }

    return this.addSingleEmbedding(input as number[]);
  }

  private addSingleEmbedding(embedding: number[]): BasePoint {
    const point = new BasePoint(embedding);

    return this.addSingleBasePoint(point);
  }

  private addSingleBasePoint(point: BasePoint, overwrite?: boolean): BasePoint {
    if (this.points[point.id] && !overwrite) {
      throw new Error(`Point with id ${point.id} already exists`);
    }

    this.points[point.id] = point;

    return point;
  }
}
