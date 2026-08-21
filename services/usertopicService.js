import { ChatPromptTemplate } from "@langchain/core/prompts";
import { generateContentAI } from "../config/generateContent.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

async function askQuestion(question, documentId) {
  console.log(question, documentId)
  const model = generateContentAI();

  // const documentId = "e09eb60f-9d1e-42f8-99bd-4c1d0f4344d8";

  const embedModel = generateEmbedding();
  const questEmbed = await embedModel.embedQuery(question);

  const relevant = await QdrantSetup.query("document", {
    query: questEmbed,
    filter: {
      must: [
        {
          key: "documentId",
          match: {
            value: documentId,
          },
        },
      ],
    },
    limit: 2,
    with_payload: true,
  });

  console.log("relevant", relevant);

  const context = relevant.points
    .map((item) => item.payload?.text ?? "")
    .join("\n\n");
  console.log("print", context);
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Answer the user's question using only the provided context.

Context:
{context}

If the answer is not present in the context, say:
"I don't know based on the provided context."`,
    ],
    ["human", "{question}"],
  ]);

  const parser = new StringOutputParser();
  const chain = prompt.pipe(model).pipe(parser);

  const result = await chain.invoke({ question, context });
  console.log(result);

  return result;
}

export const userAskQuestion = async (question, documentId) => {
  return await askQuestion(question, documentId);
};
