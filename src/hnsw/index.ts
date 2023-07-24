import { HNSW } from "./HNSW";
import type { IHNSWSettings } from "./HNSW";

export const hnswContent = { HNSW };

export default (settings?: IHNSWSettings) => new HNSW(settings);
