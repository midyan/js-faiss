import {
  getNormalizedEmbeddingByDimensionNumber,
  getEuclideanDistance,
  Point,
} from "./Point";

describe("Point", () => {
  describe("Helper Functions", () => {
    describe("getNormalizedEmbeddingByDimensionNumber", () => {
      it("should return the same array if the embeddings length is greater than the dimension number", () => {
        const embeddings = [1, 2, 3];

        const result1 = getNormalizedEmbeddingByDimensionNumber(embeddings, 6);
        const result2 = getNormalizedEmbeddingByDimensionNumber(embeddings, 2);

        expect(result1).toEqual([1, 2, 3, 0, 0, 0]);
        expect(result2).toEqual([1, 2, 3]);
      });
    });

    describe("getEuclideanDistance", () => {
      it("should return the correct distance", () => {
        const embeddings1 = [1, 1, 1];
        const embeddings2 = [0, 0, 0];

        const result = getEuclideanDistance(embeddings1, embeddings2);

        expect(result).toBe(Math.sqrt(3));
      });
    });
  });

  describe("Point Class", () => {
    it("should properly calculate NN per layer", async () => {
      const testPoint = new Point([5.1, 5.2, 5.3], 1);

      const layer2 = [new Point([1.4, 1.5, 1.6], 2)];

      const layer1 = [
        new Point([2.7, 2.8, 2.9], 1),
        new Point([3.15, 3.25, 3.35], 1),
        new Point([4.45, 4.55, 4.65], 1),
        testPoint,
      ];

      const layer0 = [
        new Point([6.75, 6.85, 6.95], 0),
        new Point([7.17, 7.27, 7.37], 0),
      ];

      const allPoints = [...layer2, ...layer1, ...layer0];

      testPoint.reindexUpToLayer(2, allPoints, [1, 2, 3]);

      expect(testPoint.nnPerLayer[0]).toHaveLength(1);
      expect(testPoint.nnPerLayer[0][0].distance).toBe(1.1258330249197699);

      expect(testPoint.nnPerLayer[1]).toHaveLength(2);
      expect(testPoint.nnPerLayer[1][0].distance).toBe(2.8578838324886475);
      expect(testPoint.nnPerLayer[1][1].distance).toBe(3.3774990747593105);

      expect(testPoint.nnPerLayer[2]).toHaveLength(3);
      expect(testPoint.nnPerLayer[2][0].distance).toBe(3.585345171667576);
      expect(testPoint.nnPerLayer[2][1].distance).toBe(4.156921938165306);
      expect(testPoint.nnPerLayer[2][2].distance).toBe(6.408587988004846);
    });
  });
});
