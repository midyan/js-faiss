import faiss from ".";
import { BasePoint } from "./BasePoint";

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
          .map((_, index) => [
            (index + 1) * (Math.random() - 0.5),
            (index + 1) * (Math.random() - 0.5),
            (index + 1) * (Math.random() - 0.5),
          ]);

        const result = hnswStore.add(points);

        for (const addedPoint of result) {
          expect(hnswStore.points[addedPoint.id]).toStrictEqual(addedPoint);
          expect(hnswStore.basePoints[addedPoint.id]).toStrictEqual(
            addedPoint.point,
          );
        }
      });

      it("should properly get approximate best match for query points", async () => {
        const queryPoints = new Array(100)
          .fill(0)
          .map(
            (_, index) =>
              new BasePoint([
                (index + 1) * (Math.random() - 0.5),
                (index + 1) * (Math.random() - 0.5),
                (index + 1) * (Math.random() - 0.5),
              ]),
          );

        const results = queryPoints.map((queryPoint) => {
          return hnswStore.query(queryPoint.embeddings);
        });

        const distancesFromQueryToResults = queryPoints.map(
          (queryPoint, index) => {
            const result = results[index];

            const dist = queryPoint.getDistance(result);

            return dist;
          },
        );

        const highestDistance = Math.max(...distancesFromQueryToResults);

        // Needs to be within 0.1
        // Needs improvement, but it's a good start
        expect(highestDistance).toBeLessThan(0.5);
      });

      it("should properly benchmark the query for 10k points", async () => {
        const queryPoints = new Array(1000)
          .fill(0)
          .map((_, index) => [
            (index + 1) * (Math.random() - 0.5),
            (index + 1) * (Math.random() - 0.5),
            (index + 1) * (Math.random() - 0.5),
          ]);

        const deltas: bigint[] = [];

        await Promise.all(
          queryPoints.map(async (queryPoint) => {
            const startNano = process.hrtime.bigint();

            hnswStore.query(queryPoint);

            const endNano = process.hrtime.bigint();

            deltas.push(endNano - startNano);
          }),
        );

        const avgOfDeltas =
          deltas.reduce((acc, curr) => acc + curr, 0n) / BigInt(deltas.length);

        const avgOfDeltasInMs = Number(avgOfDeltas) / 1000000;

        expect(avgOfDeltasInMs).toBeLessThan(50);
      });
    });
  });
});
