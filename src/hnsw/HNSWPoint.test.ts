import { HNSWPoint } from "./HNSWPoint";

describe("Point", () => {
  describe("Point Class", () => {
    it("should properly calculate NN per layer", async () => {
      const createPoint = (embeddings: number[], layerNumber: number) => {
        const basePoint = new HNSWPoint.BasePoint(embeddings);

        return new HNSWPoint(basePoint, layerNumber);
      };

      const testPoint = createPoint([5.1, 5.2, 5.3], 1);

      const layer2 = [createPoint([1.4, 1.5, 1.6], 2)];

      const layer1 = [
        createPoint([2.7, 2.8, 2.9], 1),
        createPoint([3.15, 3.25, 3.35], 1),
        createPoint([4.45, 4.55, 4.65], 1),
        testPoint,
      ];

      const layer0 = [
        createPoint([6.75, 6.85, 6.95], 0),
        createPoint([7.17, 7.27, 7.37], 0),
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
