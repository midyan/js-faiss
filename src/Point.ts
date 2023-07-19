import { v4 as uuid } from "uuid";

export interface PointDTO {
  id: string;
  embeddings: number[];
}

export class Point implements PointDTO {
  id: string;
  embeddings: number[];

  constructor(embeddings: number[], id?: string) {
    this.id = id ?? uuid();

    this.embeddings = embeddings;
  }
}
