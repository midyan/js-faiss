import { getNormalizedEmbeddingByDimensionNumber } from "./Point";

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
  });
});
