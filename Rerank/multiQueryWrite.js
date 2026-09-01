import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const multiQUeryWrite = async (question) => {
  const model = generateContentAI();
  const parser = new StringOutputParser();
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `you are an expert search query generator.
            generate a 3 different search queries for the user's question
            Each query should approach the topic from a different perspective. `,
    ],
    ["human", "{question}"],
  ]);
  const chain = chatPrompt.pipe(model).pipe(parser);

  const response = await chain.invoke({ question });

  const queries = response
    .split("\n")
    .map((query) => query.trim())
    .filter(Boolean);

  return queries;
};
