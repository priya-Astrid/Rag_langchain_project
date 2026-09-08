import { data } from "../config/vectorstore.js";
import { firstimplement } from "../hybridSearch/bm25Implement.js";
import { rrfFuncation } from "../hybridSearch/rrfFusionRetrival.js";
export const hybridDataGet = async () => {
  const vectorStore = await data();

  const userId = "priya123";
  const documentId = "8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c";
  const retriever = vectorStore.asRetriever({
    k: 1,
    filter: {
      must: [
        { key: "userId", match: { value: userId } },
        {
          key: "documentId",
          match: {
            value: documentId,
          },
        },
      ],
    },
  });

  const question = "AFTERNOON In the morning rising";

  const spareResult = await firstimplement(question);

  const DenseResult = await retriever.invoke(question);
  console.log("dense : ", DenseResult);
  const combineData = rrfFuncation([DenseResult, spareResult]);

  console.log("result her final data: ", combineData);

  const document = new Map();
  for (const doc of [...DenseResult, ...spareResult]) {
    document.set(doc.metadata.chunkId, doc);
  }
  console.log("response main", document);

  const finalDocument = combineData.map((item) => ({
    chunkId: item.id,
    score: item.score,
    document: document.get(item.id),
  }));
  const context = finalDocument
    .map((item) => item.document.pageContent)
    .join("\n\n");
  console.log("context main", context);
};
hybridDataGet();
