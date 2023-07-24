import faiss from ".";

import { BasePoint } from "./BasePoint";

describe("js-faiss", () => {
  describe("HNSW", () => {
    describe("Basic Use Case", () => {
      const hnswStore = faiss.hnsw({
        baseNN: 64,
      });

      it("should properly contruct class", async () => {
        expect(hnswStore.points).toStrictEqual({});
        expect(hnswStore.layers).toStrictEqual([]);
        expect(hnswStore.settings).toStrictEqual({
          baseNN: 64,
          probabilityThreshold: 1e-9,
        });
      });

      it("should properly add points", async () => {
        const testPoint0 = [0, 0, 0];
        const testPoint1 = [1, 1, 1];

        const addedPoint0 = hnswStore.addPoint(testPoint0);
        const addedPoint1 = hnswStore.addPoint(testPoint1);

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
