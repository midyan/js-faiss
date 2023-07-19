import { Point } from "../Point";
import { HNSW } from "./HNSW";

describe("HNSW", () => {
  const hnsw = new HNSW();

  it("should properly build hnsm store", async () => {
    await hnsw.create();
    expect(hnsw.layers.length).toBe(6);

    expect(hnsw.layers[0].level).toBe(0);

    expect(hnsw.layers[0].NN).toBe(64);
    expect(hnsw.layers[0].probability).toBe(0.96875);
    expect(hnsw.layers[0].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[1].level).toBe(1);
    expect(hnsw.layers[1].NN).toBe(96);
    expect(hnsw.layers[1].probability).toBe(0.030273437499999986);
    expect(hnsw.layers[1].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[2].level).toBe(2);
    expect(hnsw.layers[2].NN).toBe(128);
    expect(hnsw.layers[2].probability).toBe(0.0009460449218749991);
    expect(hnsw.layers[2].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[3].level).toBe(3);
    expect(hnsw.layers[3].NN).toBe(160);
    expect(hnsw.layers[3].probability).toBe(0.00002956390380859371);
    expect(hnsw.layers[3].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[4].level).toBe(4);
    expect(hnsw.layers[4].NN).toBe(192);
    expect(hnsw.layers[4].probability).toBe(9.23871994018553e-7);
    expect(hnsw.layers[4].levelMultiplier).toBe(0.28853900817779266);

    expect(hnsw.layers[5].level).toBe(5);
    expect(hnsw.layers[5].NN).toBe(224);
    expect(hnsw.layers[5].probability).toBe(2.887099981307982e-8);
    expect(hnsw.layers[5].levelMultiplier).toBe(0.28853900817779266);
  });

  it("should correctly create distribution of levels to assing to", async () => {
    const levelsToAssing: number[] = [];

    for (let i = 0; i < 1e6; i++) {
      const targetIndex = hnsw.levelToAppend;

      if (!levelsToAssing[targetIndex]) {
        levelsToAssing[targetIndex] = 0;
      }

      levelsToAssing[targetIndex]++;
    }

    const expectedDistributionOfPoints = [
      [968903, -4],
      [30091, -4],
      [968, -3],
      [36, -3],
      [2, -1],
    ];

    let level = 0;
    for (const [expectDist, errorDigits] of expectedDistributionOfPoints) {
      expect(levelsToAssing[level]).toBeCloseTo(expectDist, errorDigits);

      level += 1;
    }
  });

  it("should correctly assign points", async () => {
    const totalPoints = 100000;

    const Points = new Array(totalPoints)
      .fill(0)
      .map(() => new Point([Math.random(), Math.random(), Math.random()]));

    hnsw.append(Points);

    const expectedDistributionOfPoints = [
      [100000, -2],
      [3123, -2],
      [99, -2],
      [3, -1],
      [1, -1],
      [0, -1],
    ];

    let level = 0;
    for (const [expectDist, errorDigits] of expectedDistributionOfPoints) {
      expect(hnsw.layers[level].points.length).toBeCloseTo(
        expectDist,
        errorDigits,
      );

      level += 1;
    }
  });
});
