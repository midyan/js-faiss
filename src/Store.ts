import { BasePoint } from "./BasePoint";

export class Store {
  basePoints: { [key: string]: BasePoint } = {};

  addBasePoint(embedding: number[], overwrite?: boolean): BasePoint;
  addBasePoint(point: BasePoint, overwrite?: boolean): BasePoint;
  addBasePoint(input: number[] | BasePoint, overwrite?: boolean): BasePoint {
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
    if (this.basePoints[point.id] && !overwrite) {
      throw new Error(`Point with id ${point.id} already exists`);
    }

    this.basePoints[point.id] = point;

    return point;
  }
}
