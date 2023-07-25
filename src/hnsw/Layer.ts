import { HNSW } from "./HNSW";

export interface ILayerSettings {
  baseNN: number;
}

export class Layer {
  store: HNSW;
  settings: ILayerSettings;

  NN: number;
  level: number;
  assignPropability: number;

  constructor(level: number, layerSettings: ILayerSettings, store: HNSW) {
    this.level = level;
    this.store = store;

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
    const pointsOfLayer = Object.values(this.store.points).filter(
      (point) => point.maxLayerNumber <= this.level,
    );

    return pointsOfLayer[Math.floor(Math.random() * pointsOfLayer.length)];
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
