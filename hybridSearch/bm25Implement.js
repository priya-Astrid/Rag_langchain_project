import { createBM25Retriver } from "./BM25Retriever.js";
import { Document } from "@langchain/core/documents";

const document = [
  new Document({
    pageContent:
      "A collection is a group of related documents, similar to a table in SQL.",
  }),
 new Document({
    pageContent:
      "A document is a JSON-like record stored inside a MongoDB collection.",
  }),

  new Document({
    pageContent:
      "BSON stands for Binary JSON. It is the binary format MongoDB uses to store documents efficiently.",
  }),

  new Document({
    pageContent:
      "My name is priya yadav. Thank you for giving opportunity.",
  }),

  new Document({
    pageContent:
      "MongoDB is scalable, schema-flexible, fast for reads/writes, and well-suited for modern web applications.",
  }),

];

export const firstimplement = async () => {
  const bm25Retriever = await createBM25Retriver(document,{
    k:1
  });
  const result = await bm25Retriever.invoke("what is my name");
  console.log("result", result);
};

firstimplement();