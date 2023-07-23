import { Store } from "../Store";
import { Layer } from "./Layer";

export interface IHNSWSettings {
  baseNN: number;
  probabilityThreshold: number;
}

export class HNSW extends Store {
  static defaultSettings: IHNSWSettings = {
    baseNN: 32,
    probabilityThreshold: 1e-9,
  };

  layers: Layer[] = [];
  settings: IHNSWSettings;

  constructor(settings?: IHNSWSettings) {
    super();

    this.settings = {
      ...HNSW.defaultSettings,
      ...(settings ?? {}),
    };
  }

  get entryLayer(): Layer | null {
    return this.layers.find((layer) => layer.points.length > 0) ?? null;
  }
}
