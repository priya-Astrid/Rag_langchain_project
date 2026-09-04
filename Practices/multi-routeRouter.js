// llm Based router

import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const multiRouterRouter = async () => {
  const question = "what is mongodb";
  const model = generateContentAI();
  const parser = new StringOutputParser();
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      ` You are a query router for a RAG system.
    Classify the user's question into exactly one route.

DIRECT:
use when the question is clear, simple and can usually be answered with one search query.

REWRITE:
Use when the question is ambiguous, conversational,
contains references like "it", "this", "that", or
needs to be rewritten into a standalone search query.

MULTI_QUERY:
Use when the question is broad, complex, comparative,
or requires multiple search perspectives.

Return ONLY one of:

direct
rewrite
multi_query

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

// multiRouterRouter();
/**
 * 
 *  [
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
 */
