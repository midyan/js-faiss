import { Point } from "../Point";

export class Layer {
  level: number;
  NN: number;
  probability: number;
  levelMultiplier: number;
  points: Point[] = [];

  constructor(level: number, baseNN: number, levelMultiplier: number) {
    this.level = level;
    this.NN = baseNN * (level + 2);
    this.levelMultiplier = levelMultiplier;
    this.probability =
      Math.exp(-level / levelMultiplier) * (1 - Math.exp(-1 / levelMultiplier));
  }

  canAppendPoint() {
    return Math.random() < this.probability;
  }

  get stats() {
    return {
      level: this.level,
      NN: this.NN,
      probability: this.probability,
      levelMultiplier: this.levelMultiplier,
      points: this.points.length,
    };
  }
}
