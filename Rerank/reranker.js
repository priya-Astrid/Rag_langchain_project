import { data } from "../config/vectorstore.js";
import { multiQUeryWrite } from "./multiQueryWrite.js";
import dotenv from "dotenv";
import { CohereRerank } from "@langchain/cohere";
dotenv.config();

export const reranker = async () => {
  const vectorStore = await data();
  const userId = "priya123";

  const retriever = vectorStore.asRetriever({
    k: 5,
    filter: {
      must: [{ key: "userId", match: { value: userId } }],
    },
  });

  const question = "in the afternoon";

  const queries = await multiQUeryWrite(question);
  const results = await Promise.all(
    queries.map((query) => retriever.invoke(query)),
  );
  const allResult = results.flat();

  const uniqueResult = Array.from(
    new Map(allResult.map((doc) => [doc.id, doc])).values(),
  );
  console.log("unique documents:", uniqueResult.length);
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
  console.log("final Result", finalResult);
};
reranker();

// output :=

// unique documents: 9
// document [
//   'AFTERNOON\n' +
//     'In the morning rising behind the roof,\n' +
//     'in the shelter of the bridge,\n' +
//     'in the corner of cypress trees extending past the wall,\n' +
//     'a cock has crowed.',
//   'Under the ardent sun,\n' +
//     'when the landscape flames,\n' +
//     'the traveler crosses the stream on a very narrow bridge,\n' +
//     'in front of a black hollow\n' +
//     'where the trees edge along the water napping in the afternoon.',
//   'the unique street leading from the river to the mountain\n' +
//     'and parting the wood.\n' +
//     'A few other words are sought\n' +
//     'but the ideas are still just as black,\n' +
//     'just as simple and oddly painful.',
//   'In the righthand corner,\n' +
//     'the last house with a larger head at the window.\n' +
//     'The trees are intensely vital,\n' +
//     'and all these familiar companions border on the demolished wall,',
//   'a cock has crowed.\n' +
//     'In the bell tower whose glittering peak splits the air,\n' +
//     'the notes are sounding \n' +
//     'and already morning noises rise in the only street;',
//   'efficiently.\n' +
//     'Q: Why use MongoDB?\n' +
//     'A: MongoDB is scalable, schema-flexible, fast for reads/writes, and well-suited for modern \n' +
//     'web applications.\n' +
//     '5/5',
//   'web applications.\n' +
//     '5/5\n' +
//     'Q: My name is priya yadav. thank you for giving opportunity.\n' +
//     '1',
//   'just as simple and oddly painful.\n' +
//     'Little more than eyes,  open air,\n' +
//     'the grass and the water in the background,\n' +
//     'with a spring or a cool basin at every turn.\n' +
//     'In the righthand corner,',
//   'And against the backdrop of quivering wood,\n' +
//     'the man motionless.\n' +
//     "Enjoy every moment don't wait right time. time is\n" +
//     'remove very fast.\n' +
//     'if you are not vaue time, time is\n' +
//     'not value you'
// ]
// reranked result: [
//   { index: 0, relevanceScore: 0.40952834 },
//   { index: 1, relevanceScore: 0.39543822 },
//   { index: 4, relevanceScore: 0.05382461 }
// ]
// PS C:\Users\admin\Documents\GitHub\Rag_langchain_project>
