import { HNSW } from "./HNSW";

describe("HNSW", () => {
  it("should properly build hnsm store", async () => {
    const hnsw = new HNSW();
    await hnsw.create([]);
    expect(hnsw.layers.length).toBe(6);

    expect(hnsw.layers[0].level).toBe(0);
    expect(hnsw.layers[0].NN).toBe(32);
    expect(hnsw.layers[0].probability).toBe(0.96875);
    expect(hnsw.layers[0].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[1].level).toBe(1);
    expect(hnsw.layers[1].NN).toBe(64);
    expect(hnsw.layers[1].probability).toBe(0.030273437499999986);
    expect(hnsw.layers[1].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[2].level).toBe(2);
    expect(hnsw.layers[2].NN).toBe(96);
    expect(hnsw.layers[2].probability).toBe(0.0009460449218749991);
    expect(hnsw.layers[2].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[3].level).toBe(3);
    expect(hnsw.layers[3].NN).toBe(128);
    expect(hnsw.layers[3].probability).toBe(0.00002956390380859371);
    expect(hnsw.layers[3].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[4].level).toBe(4);
    expect(hnsw.layers[4].NN).toBe(160);
    expect(hnsw.layers[4].probability).toBe(9.23871994018553e-7);
    expect(hnsw.layers[4].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[5].level).toBe(5);
    expect(hnsw.layers[5].NN).toBe(192);
    expect(hnsw.layers[5].probability).toBe(2.887099981307982e-8);
    expect(hnsw.layers[5].levelMultiplier).toBe(0.28853900817779266);
  });
});
