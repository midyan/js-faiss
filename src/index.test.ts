import * as faiss from ".";
import { BasePoint } from "./BasePoint";
import { geometry } from "./utils";

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
            points: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 96,
            assignPropability: 0.030273437499999986,
            level: 1,
            points: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 128,
            assignPropability: 0.0009460449218749991,
            level: 2,
            points: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 160,
            assignPropability: 0.00002956390380859371,
            level: 3,
            points: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 192,
            assignPropability: 9.23871994018553e-7,
            level: 4,
            points: 0,
            settings: {
              baseNN: 32,
            },
          },
          {
            NN: 224,
            assignPropability: 2.887099981307982e-8,
            level: 5,
            points: 0,
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
        const size = 9;

        const points = geometry.create3DGridOfSize(size);

        expect(points.length).toBe(size % 2 !== 0 ? size ** 3 : size ** 3 - 1);

        const result = hnswStore.add(points);

        const pointsInLayer = Object.keys(hnswStore.layers[0].points).length;

        expect(pointsInLayer).toBe(points.length);

        for (const addedPoint of result) {
          expect(hnswStore.points[addedPoint.id]).toStrictEqual(addedPoint);
          expect(hnswStore.basePoints[addedPoint.id]).toStrictEqual(
            addedPoint.point,
          );
        }
      });

      it("should properly get approximate best match for query points and benchmark it", async () => {
        const queryPoints = geometry.create3DGridOfSize(9).map((point) => {
          return new BasePoint(
            point.map((coordinate) => coordinate * Math.random()),
          );
        });

        // Found by running the query on the store and checking the distance
        const maxDistance = 0.2;

        const deltas: bigint[] = [];

        for (const queryPoint of queryPoints) {
          const startNano = process.hrtime.bigint();

          const result = hnswStore.query(queryPoint.embeddings);

          const endNano = process.hrtime.bigint();

          deltas.push(endNano - startNano);

          const distance = result.getDistance(queryPoint);

          expect(distance).toBeLessThan(maxDistance);
        }

        const avgOfDeltas =
          deltas.reduce((acc, curr) => acc + curr, 0n) / BigInt(deltas.length);

        const avgOfDeltasInMs = Number(avgOfDeltas) / 1000000;

        expect(avgOfDeltasInMs).toBeLessThan(50);
      });
    });
  });
});
