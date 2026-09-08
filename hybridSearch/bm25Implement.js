import { createBM25Retriver } from "./BM25Retriever.js";
import { Document } from "@langchain/core/documents";

const document = [
  new Document({
    pageContent:
      "AFTERNOON In the morning rising behind the roof, in the shelter of the bridge, in the corner of cypress trees extending past the wall, a cock has crowed.",
    metadata: {
      chunkId: "chunk-1",
      userId: "priya123",
       documentId :"8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c"
    }
    },
  
),
  new Document({
    pageContent:
      "A document is a JSON-like record stored inside a MongoDB collection.",
       metadata: {
      chunkId: "chunk-2",
      userId: "priya123",
       documentId :"8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c"
    }
  }),

  new Document({
    pageContent:
      "BSON stands for Binary JSON. It is the binary format MongoDB uses to store documents efficiently.",
       metadata: {
      chunkId: "chunk-3",
      userId: "priya123",
       documentId :"8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c"
    }
  }),

  new Document({
    pageContent:'the unique street leading from the river to the mountain\n' +
      'and parting the wood.' +
      'A few other words are sought' +
      'but the ideas are still just as black,' +
      'just as simple and oddly painful.',
     metadata: {
      chunkId: "30115547-7c44-47dd-93ee-17e26ea5a492",
      userId: "priya123",
       documentId :"8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c"
    }
  }),

  new Document({
    pageContent:
      "MongoDB is scalable, schema-flexible, fast for reads/writes, and well-suited for modern web applications.",
       metadata: {
      chunkId: "chunk-5",
      userId: "priya123",
       documentId : "8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c"
    }
  }),
];

export const firstimplement = async (question) => {
  const bm25Retriever = await createBM25Retriver(document, {
    k: 1,
  });
  const result = await bm25Retriever.invoke(question);
  console.log("result bm25", result);
  return result;
};

// firstimplement();
