import { ChatPromptTemplate } from "@langchain/core/prompts";
import dotenv from "dotenv";
import { generateContentAI } from "../config/generateContent.js";
import { StringOutputParser } from "@langchain/core/output_parsers";
dotenv.config();

export const queryWriting = async (question) => {
  const parser = new StringOutputParser();
  const model = generateContentAI();
  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `Rewrite the user's question into a clear and standalone 
      search query for a vector database
      return only the rewritten query.`,
    ],
    ["human", "{question}"],
  ]);

  const chain = chatPrompt.pipe(model).pipe(parser);

  const response = await chain.invoke({ question });
  console.log("response: ", response);
 return response;
};
// queryWriting("what is node js");
