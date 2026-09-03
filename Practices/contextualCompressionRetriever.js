import { ContextualCompressionRetriever } from "@langchain/classic/retrievers/contextual_compression";
import { LLMChainExtractor } from "@langchain/classic/retrievers/document_compressors/chain_extract";
import { generateContentAI } from "../config/generateContent.js";

import dotenv from "dotenv";
import { data } from "../config/vectorstore.js";
dotenv.config();
export const contextualCompressor = async () => {
  // basic retriever
  const vectorStore = await data();
  const userId = "priya123";

  const retriever = vectorStore.asRetriever({
    k: 2,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
  });

  const question = "why is mongoDB";
  // 3. gemini compressor
  const model = generateContentAI();
  const compressor = LLMChainExtractor.fromLLM(model);
  //  4. contextal compression retriever

  const compressionRetriever = new ContextualCompressionRetriever({
    baseRetriever: retriever,
    baseCompressor: compressor,
  });
  // 5.
  const result = await compressionRetriever.invoke(question);
  console.log("comptressed documenyt", result);
};

contextualCompressor();

// Original Document
//         ↓
//    Base Retriever
//         ↓
//    Retrieved Document
//         ↓
// LLMChainExtractor
//         ↓
// Relevant content only
//         ↓
// Compressed Document


// comptressed documenyt [
//   Document {
//     pageContent: 'MongoDB is scalable, schema-flexible, fast for reads/writes, and well-suited for modern \n' +
//       'web applications.',
//     metadata: {
//       source: 'upload\\d813224b0b94115d7095960097726271',
//       pdf: [Object],
//       loc: [Object]
//     },
//     id: undefined
//   }
// ]