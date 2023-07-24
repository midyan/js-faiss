import { HNSW } from "./HNSW";
import type { IHNSWSettings } from "./HNSW";

export const hnswContent = { HNSW };

export default (settings?: Partial<IHNSWSettings>) => new HNSW(settings);
