import { data } from "../config/vectorstore.js";
import { multiQUeryWrite } from "./multiQueryWrite.js";
import dotenv from "dotenv";
import { CohereRerank } from "@langchain/cohere";
import { contextCompressor } from "../utils/contextCompression.js";
// import { practiceData } from "../utils/practiceCompressor.js";
import { generateAnswer } from "./generateAnswer.js";
import { multiRouterRouter } from "./QueryRouter/multi-routeRouter.js";
import { queryWriting } from "./QueryRewriter.js";
dotenv.config();
// manual context compression practice

export const QueryRouterCompelete = async () => {
  const vectorStore = await data();
  const userId = "priya123";

  let uniqueResult = [];
  const question = "what is my name";

  // query Router

  const route = await multiRouterRouter(question);
  console.log(" router run ", route);
  const retriever = vectorStore.asRetriever({
    k: 5,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
  });
  if (route === "direct") {
    const result = await retriever.invoke(question);
    uniqueResult = result;
  }
  if (route === "rewrite") {
    const queryImprove = await queryWriting(question);
    const result = await retriever.invoke(queryImprove);
    uniqueResult = result;
  }
  if (route === "multi_query") {
    const queries = await multiQUeryWrite(question);
    const results = await Promise.all(
      queries.map((query) => retriever.invoke(query)),
    );
    const allResult = results.flat();

    uniqueResult = Array.from(
      new Map(allResult.map((doc) => [doc.id, doc])).values(),
    );
    console.log("unique documents:", uniqueResult.length);
  }

  const rerankResult = new CohereRerank({
    apiKey: process.env.COHERE_API_KEY,
    model: "rerank-v3.5",
    topN: 3,
  });

  const document = uniqueResult.map((doc) => doc.pageContent);
  console.log("document", document);

  const rankedResult = await rerankResult.rerank(document, question);
  console.log("reranked result:", rankedResult);

  const finalResult = rankedResult.map((result) => uniqueResult[result.index]);

  // context compression
  const compressedResult = await Promise.all(
    finalResult.map((doc) => contextCompressor(question, doc.pageContent)),
  );

  const finalContext = compressedResult
    .filter(
      (content) =>
        content &&
        !content.toLowerCase().includes("no relevant information found"),
    )
    .join("\n\n");

  console.log("compress context", finalContext);

  const answer = await generateAnswer(question, finalContext);

  console.log("final Result answer", answer);
};
QueryRouterCompelete();
