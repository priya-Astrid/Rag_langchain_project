import { StringOutputParser } from "@langchain/core/output_parsers";
import { generateContentAI } from "../config/generateContent.js";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// manual context compression practice

export const contextCompressor = async (question, document) => {
  const model = generateContentAI();
  const parser = new StringOutputParser();

  const chatPrompt = ChatPromptTemplate.fromMessages([
    [
      "system",
      `
        you are a context compression assistant.
        your job is to extract only the infomation from the document that is relevant to the user's question.
        Rules: 
        Do not add infomation that is not present in the document.
        Do not answer the question 
        only return the relevant infomation.
        if the document contains no relevant infomation return " no relevant infomation found"  
        `,
    ],
    ["human", `user question {question} Document {document}`],
  ]);

  const chain = chatPrompt.pipe(model).pipe(parser);

  const result = await chain.invoke({ question, document });
  return result.trim();
};
