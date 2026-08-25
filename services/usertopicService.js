import { ChatPromptTemplate } from "@langchain/core/prompts";
import { generateContentAI } from "../config/generateContent.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

async function askQuestion(question, documentId, userId) {
  const Top_K = 10;
  const Score_threshold = 0.58;
  console.log("user want", question, documentId, userId);
  const model = generateContentAI();

  // const documentId = "e09eb60f-9d1e-42f8-99bd-4c1d0f4344d8";

  const embedModel = generateEmbedding();
  const questEmbed = await embedModel.embedQuery(question);

  const relevant = await QdrantSetup.query("MultiPdfStore", {
    query: questEmbed,
    filter: {
      must: [
        {
          key: "userId",
          match: {
            value: userId,
          },
        },
        {
          key: "documentId",
          match: {
            value: documentId,
          },
        },
      ],
    },
    limit: Top_K,
    with_payload: true,
  });

  console.log("relevant", relevant);

  const relevantScore = relevant.points.filter(
    (item) => item.score >= Score_threshold,
  );
  const data = relevantScore.map((item) => ({
      score: item.score,
      text: item.payload.text,
    }));
  console.log(
    "reevant chiunsdf",data  );
  if (relevantScore.length === 0) {
    return "I don't know based on the provide content";
  }

  const context = relevantScore
    .map((item) => item.payload?.text ?? "")
    .filter(Boolean)
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

export const userAskQuestion = async (question, documentId, userId) => {
  return await askQuestion(question, documentId, userId);
};
