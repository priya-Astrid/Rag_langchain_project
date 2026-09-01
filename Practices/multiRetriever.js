import { data } from "../config/vectorstore.js";
import { multiQuery } from "./multiQueryRetriever.js";

const multiRetriever = async () => {
  const vectorStore = await data();

  const userId = "priya123";
  const documentId = "8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c";

  const retriever = vectorStore.asRetriever({
    k: 3,
    filter: {
      must: [
        { key: "userId", match: { value: userId } },
        {
          key: "documentId",
          match: { value: documentId },
        },
      ],
    },
  });
  //   let arrResults = [];

  const question = "in the afternoon";
  const queries = await multiQuery(question);
  //   sequential retriever
  //   for (const query of queries) {
  //     const result = await retriever.invoke(query);
  //     console.log("result: ", result);
  //     arrResults.push(...result);
  //   }
  // parallel retriever
  const results = await Promise.all(
    queries.map((query) => retriever.invoke(query)),
  );
  //   arrResults.push(...results.flat());
  const arrResults = results.flat();

  //   count how many queries retrieved each document
  const frequency = new Map();
  for (const doc of arrResults) {
    frequency.set(doc.id, (frequency.get(doc.id) || 0) + 1);
  }
  //   remove duplicate documents based on their id
  const uniqueResult = Array.from(
    new Map(arrResults.map((doc) => [doc.id, doc]).values()),
  );

  // rank document by frequency
  const rankingResult = uniqueResult.sort(
    (a, b) => frequency.get(b.id) - frequency.get(a.id),
  );
  const topResults = rankingResult.slice(0, 3);
  console.log("topResults: ", topResults);
  console.log("uniqueResult: ", uniqueResult.length);
};
multiRetriever();
