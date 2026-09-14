import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import { QdrantVectorStore } from "@langchain/qdrant";
import dotenv from "dotenv";
dotenv.config();

export const data = async () => {
  const embedding = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
    apiKey: process.env.GENAI_SECRET_KEYS,
  });

  const vectorStore = await QdrantVectorStore.fromExistingCollection(
    embedding,
    {
      url: process.env.QDRANT_URL,
      apiKey: process.env.QDRANT_API_KEY,
      collectionName: "MultiPdfStore",
      contentPayloadKey:"text"
    },
  );
  return vectorStore;
};

