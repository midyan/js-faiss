import faiss from ".";

import { BasePoint } from "./BasePoint";

describe("js-faiss", () => {
  describe("HNSW", () => {
    describe("Basic Use Case", () => {
      const hnswStore = faiss.hnsw({
        baseNN: 64,
      });

      it("should properly contruct class", async () => {
        expect(hnswStore.basePoints).toStrictEqual({});
        expect(hnswStore.layersStats).toStrictEqual([
          {
            NN: 128,
            assignPropability: 0.984375,
            level: 0,
            settings: {
              baseNN: 64,
            },
          },
          {
            NN: 192,
            assignPropability: 0.015380859375000007,
            level: 1,
            settings: {
              baseNN: 64,
            },
          },
          {
            NN: 256,
            assignPropability: 0.00024032592773437516,
            level: 2,
            settings: {
              baseNN: 64,
            },
          },
          {
            NN: 320,
            assignPropability: 0.0000037550926208496102,
            level: 3,
            settings: {
              baseNN: 64,
            },
          },
          {
            NN: 384,
            assignPropability: 5.867332220077524e-8,
            level: 4,
            settings: {
              baseNN: 64,
            },
          },
        ]);
        expect(hnswStore.settings).toStrictEqual({
          baseNN: 64,
          probabilityThreshold: 1e-9,
        });
      });

      it("should properly add points", async () => {
        const testPoint0 = [0, 0, 0];
        const testPoint1 = [1, 1, 1];

        const addedPoint0 = hnswStore.addBasePoint(testPoint0);
        const addedPoint1 = hnswStore.addBasePoint(testPoint1);

        expect(addedPoint0).not.toBeNull();
        expect(addedPoint0).toBeInstanceOf(BasePoint);
        expect(addedPoint0?.id).toBeTruthy();

        expect(addedPoint1).not.toBeNull();
        expect(addedPoint1).toBeInstanceOf(BasePoint);
        expect(addedPoint1.id).toBeTruthy();

        expect(addedPoint0.id).not.toBe(addedPoint1.id);

        const distance = addedPoint0.getDistance(addedPoint1);

        expect(distance).toBeCloseTo(1.7320508075688772);
      });
    });
  });
});
