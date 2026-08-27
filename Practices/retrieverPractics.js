import { data } from "../config/vectorstore.js";
export const RetrievalData = async () => {
  const vectorStore = await data();

  const userId = "priya123";
  const documentId = "8b6c70f7-0a4e-40f0-89c1-41f463c7ec8c";
  const retriever = vectorStore.asRetriever({
    k: 2,
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
    //mmr concept
    searchType: "mmr",
    searchKwargs: {
      fetchK: 5,
    },
  });

  const question = "in the afternoon";
  const result = await retriever.invoke(question);
  console.log("result: ", result);
};
RetrievalData();
