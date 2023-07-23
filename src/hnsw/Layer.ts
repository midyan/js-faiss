import { HNSWPoint } from "./HNSWPoint";

export class Layer {
  level: number;

  NN: number;
  probability: number;
  levelMultiplier: number;

  points: HNSWPoint[] = [];

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

  getRandomPoint() {
    return this.points[Math.floor(Math.random() * this.points.length)];
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
