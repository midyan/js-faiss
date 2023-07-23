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

  for (let i = 0; i < embeddings1.length; i++) {
    const diff = (embeddings1[i] || 0) - (embeddings2[i] || 0);

    sum += diff ** 2;
  }

  return Math.sqrt(sum);
};
