import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// manual context compression practice

export const generateAnswer = async (question, context) => {
  const model = generateContentAI();
  const parser = new StringOutputParser();

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `You are a helpful RAG assistant.

Answer the user's question using ONLY the provided context.

If the answer is not present in the context,
say "I don't know based on the provided documents."`,
    ],
    [
      "human",
      `Question:
{question}

Context:
{context}`,
    ],
  ]);
  const chain = chatPrompt.pipe(model).pipe(parser);
  const finalResult = await chain.invoke({
    question,
    context,
  });

  return finalResult;
};
