import { BM25Retriever } from "@langchain/community/retrievers/bm25";

export const createBM25Retriver = async (document) => {
  const retriever = BM25Retriever.fromDocuments(document, {
    k: 5,
  });
  return retriever;
};
