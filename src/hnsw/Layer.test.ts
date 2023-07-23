import { Layer } from "./Layer";

describe("Layer", () => {
  it("Should set the level, NN, levelMultiplier, and probability properties ", async () => {
    const settings = {
      baseNN: 32,
      levelMultiplier: 10,
    };
    const layers = new Array(5)
      .fill(0)
      .map((_, index) => new Layer(index, settings));

    expect(layers[0].settings).toStrictEqual(settings);
    expect(layers[0].NN).toBe(64);
    expect(layers[0].level).toBe(0);
    expect(layers[0].assignPropability).toBe(0.09516258196404048);
    expect(layers[0].points).toStrictEqual([]);

    expect(layers[1].settings).toStrictEqual(settings);
    expect(layers[1].NN).toBe(96);
    expect(layers[1].level).toBe(1);
    expect(layers[1].assignPropability).toBe(0.08610666495797777);
    expect(layers[1].points).toStrictEqual([]);

    expect(layers[2].settings).toStrictEqual(settings);
    expect(layers[2].NN).toBe(128);
    expect(layers[2].level).toBe(2);
    expect(layers[2].assignPropability).toBe(0.07791253239626403);
    expect(layers[2].points).toStrictEqual([]);

    expect(layers[3].settings).toStrictEqual(settings);
    expect(layers[3].NN).toBe(160);
    expect(layers[3].level).toBe(3);

    expect(layers[4].settings).toStrictEqual(settings);
    expect(layers[4].NN).toBe(192);
    expect(layers[4].level).toBe(4);
  });
});
