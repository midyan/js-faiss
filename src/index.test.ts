import faiss from ".";

describe("js-faiss", () => {
  describe("HNSW", () => {
    describe("Basic Use Case", () => {
      const hnswStore = faiss.hnsw({
        baseNN: 32,
      });

      it("should properly contruct class", async () => {
        expect(hnswStore.basePoints).toStrictEqual({});
        expect(hnswStore.layersStats).toStrictEqual([
          {
            NN: 64,
            assignPropability: 0.96875,
            level: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 96,
            assignPropability: 0.030273437499999986,
            level: 1,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 128,
            assignPropability: 0.0009460449218749991,
            level: 2,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 160,
            assignPropability: 0.00002956390380859371,
            level: 3,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 192,
            assignPropability: 9.23871994018553e-7,
            level: 4,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 224,
            assignPropability: 2.887099981307982e-8,
            level: 5,
            settings: {
              baseNN: 32,
            },
          },
        ]);

        expect(hnswStore.settings).toStrictEqual({
          baseNN: 32,
          probabilityThreshold: 1e-9,
        });
      });

      it("should properly add points", async () => {
        const points = new Array(10000)
          .fill(0)
          .map((_, index) => [index, index, index]);

        const result = hnswStore.add(points);

        for (const addedPoint of result) {
          expect(hnswStore.points[addedPoint.id]).toStrictEqual(addedPoint);
          expect(hnswStore.basePoints[addedPoint.id]).toStrictEqual(
            addedPoint.point,
          );
        }
      });
    });
  });
});
