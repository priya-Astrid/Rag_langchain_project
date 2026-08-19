import { ChatPromptTemplate } from "@langchain/core/prompts";
import { generateContentAI } from "../config/generateContent.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

async function askQuestion(question) {
  const model = generateContentAI();

  const embedModel = generateEmbedding();
  const questEmbed = await embedModel.embedQuery(question);

  const relevant = await QdrantSetup.query("document", {
    query: questEmbed,
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

export const userAskQuestion = async (question) => {
  return await askQuestion(question);
};
