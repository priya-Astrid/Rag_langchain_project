// llm Based router

import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const llmBasedRouterApproach = async () => {
  const question = "what is mongodb";
  const model = generateContentAI();
  const parser = new StringOutputParser();
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
You are a query router for a RAG system.

Classify the user's question into exactly one category.

SIMPLE:
The question can usually be answered using
one direct search query.

COMPLEX:
The question requires multiple search perspectives,
comparison, deeper reasoning, or broader retrieval.

Return ONLY one word:

simple

or

complex
        `,
    ],
    ["human", "{question}"],
  ]);
  const chain = chatPrompt.pipe(model).pipe(parser);

  const result = await chain.invoke({ question });

  const route = result.trim().toLowerCase();

  console.log("response router: ", route);

  return route;
};

llmBasedRouterApproach();
/**
 *
 *
 */
