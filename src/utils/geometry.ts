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
