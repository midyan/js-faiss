import { HNSW } from "./HNSW";

describe("HNSW", () => {
  const hnsw = new HNSW();
  it("should initialize wiht default settings", async () => {
    expect(hnsw.settings).toEqual(HNSW.defaultSettings);
  });

  it("should have entry layer null when no layer is created", async () => {
    expect(hnsw.layers).toHaveLength(0);
    expect(hnsw.entryLayer).toBeNull();
  });
});
