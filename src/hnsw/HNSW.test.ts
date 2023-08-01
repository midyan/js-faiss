import { HNSW } from "./HNSW";

describe("HNSW", () => {
  const hnsw = new HNSW();
  it("should initialize wiht default settings", async () => {
    expect(hnsw.settings).toEqual(HNSW.defaultSettings);
  });

  it("should have entry layer null when no layer is created", async () => {
    expect(hnsw.layers).toHaveLength(6);
    expect(hnsw.entryLayer.stats).toStrictEqual({
      NN: 64,
      assignPropability: 0.96875,
      level: 0,
      points: 0,
      settings: {
        baseNN: 32,
      },
    });
  });
});
