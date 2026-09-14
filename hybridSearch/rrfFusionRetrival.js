export const rrfFuncation = (resultList, k = 60) => {
  const scores = new Map();
  for (const result of resultList) {
    result.forEach((result, index) => {
      const rank = index + 1;
      const score = 1 / (k + rank);
      
      scores.set(result.metadata.chunkId, (scores.get(result.metadata.chunkId) || 0) + score);
    });
  }

  return [...scores.entries()]
    .map(([id, score]) => ({
      id,
      score,
    }))
    .sort((a, b) => b.score - a.score);

};
