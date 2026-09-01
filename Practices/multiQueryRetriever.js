import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";

export const multiQuery = async (question) => {
  const model = generateContentAI();
  const parser = new StringOutputParser();
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `you are an expert search query generator.
         generate 3 different seach queries fo the user's question
         Each query should approach the topic from a different perspective.

Return ONLY the queries, one query per line.
Do not add numbering or explanations.`,
    ],

    ["human", "{question}"],
  ]);
  const chain = chatPrompt.pipe(model).pipe(parser);
  const response = await chain.invoke({ question });
  console.log("response", response);
};
multiQuery("what is node.js");
