import { ChatPromptTemplate } from "@langchain/core/prompts";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";
import { Parent } from "./parentStoredb.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { connectMongodb } from "../config/mongodb.js";

export const userAskQuestion = async () => {
  await connectMongodb();
  const question = "in the Afternoon";
  const Top_K = 3;
  const Score_threshold = 0.7;
  const model = generateContentAI();
  const embedModel = generateEmbedding();

  const parser = new StringOutputParser();
  const questionEmbed = await embedModel.embedQuery(question);

  const relavent = await QdrantSetup.query("ChildPdfStore", {
    query: questionEmbed,

    limit: Top_K,
    with_payload: true,
  });

  const relavantScore = relavent.points.filter(
    (item) => item.score >= Score_threshold,
  );
  console.log("relavent chunk:", relavantScore);

  const getParentId = relavantScore.map((item) => item.payload.parentId);
  console.log("get", getParentId);

  const uniqueParentIds = [...new Set(getParentId)];
  //  if not relevant document found
  console.log("get unique", uniqueParentIds);

  if (uniqueParentIds.length === 0) {
    return "I don't know based on the provided context.";
  }
  const findParenttext = await Parent.find({
    parentId: {
      $in: uniqueParentIds,
    },
  });
  console.log("get findParenttext", findParenttext);

  //   if parent document not found
  if (findParenttext.length === 0) {
    return "i don't know based on the provided context..";
  }
  const context = findParenttext.map((parent) => parent.text).join("\n\n");
  const prompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful question-answering assistant.

Answer the user's question using ONLY the provided context.

Context:
{context}

If the answer is present in the context, answer it directly.
Do not say "I don't know" when the context contains the answer.`,
    ],
    ["human", "{question}"],
  ]);
  console.log("get text", context);

  const chain = prompt.pipe(model).pipe(parser);
  const formattedPrompt  = await prompt.format({
    question, 
    context
  })
  console.log("formatted Prompt:",formattedPrompt)
  const finalAnswer = await chain.invoke({ question, context });
  console.log("result :", finalAnswer);
};

userAskQuestion();

/**
 * 
 * 
result : Based on the provided context titled "AFTERNOON," the following occurs:

*   A cock has crowed in the morning rising behind the roof, in the shelter of the bridge, and in the corner of cypress trees extending past the wall.
*   Notes are sounding in the bell tower.
*   Morning noises are rising in the only street.

 */