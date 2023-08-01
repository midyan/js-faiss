export const getNormalizedEmbeddingByDimensionNumber = (
  embeddings: number[],
  dimensionNumber: number,
) => {
  if (embeddings.length > dimensionNumber) {
    return embeddings;
  }

  const diff = dimensionNumber - embeddings.length;

  return embeddings.concat(new Array(diff).fill(0));
};

export const getEuclideanDistance = (
  embeddings1: number[],
  embeddings2: number[],
) => {
  let sum = 0;

  const size = Math.max(embeddings1.length, embeddings2.length);

  for (let i = 0; i < size; i++) {
    const diff = (embeddings1[i] || 0) - (embeddings2[i] || 0);

    sum += diff ** 2;
  }

  return Math.sqrt(sum);
};

export const getVectorOfSize = (size: number) => new Array(size).fill(0);

export const create3DGridOfSize = (size: number): number[][] => {
  const offset = size / 2;

  const grid = getVectorOfSize(size).map((_, x) =>
    getVectorOfSize(size).map((_, y) =>
      getVectorOfSize(size)
        .map((_, z) => {
          const pX = x - offset;
          const pY = y - offset;
          const pZ = z - offset;

          if (pX === 0 && pY === 0 && pZ === 0) {
            return null;
          }

          return [pX, pY, pZ];
        })
        .filter((point) => point !== null),
    ),
  );

  return grid.flat(2) as number[][];
};
