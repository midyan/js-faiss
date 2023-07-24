import { HNSWPoint } from "./HNSWPoint";

export interface ILayerSettings {
  baseNN: number;
}

export class Layer {
  settings: ILayerSettings;

  NN: number;
  level: number;
  assignPropability: number;

  points: HNSWPoint[] = [];

  constructor(level: number, layerSettings: ILayerSettings) {
    this.level = level;

    this.settings = {
      ...layerSettings,
    };

    this.NN = this.settings.baseNN * (level + 2);
    this.assignPropability =
      Math.exp(-level / this.levelMultiplier) *
      (1 - Math.exp(-1 / this.levelMultiplier));
  }

  canAppendPoint() {
    return Math.random() < this.assignPropability;
  }

  getRandomPoint() {
    return this.points[Math.floor(Math.random() * this.points.length)];
  }

  // ---

  get levelMultiplier() {
    return 1 / Math.log(this.settings.baseNN);
  }

  get stats() {
    return {
      NN: this.NN,
      level: this.level,
      settings: this.settings,
      assignPropability: this.assignPropability,
    };
  }
}
