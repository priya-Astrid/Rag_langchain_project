import { generateContentAI } from "../config/generateContent.js";

export const hypotheticGenerate = async (question) => {
  const model = generateContentAI();

  const PromptGenerate = `
    you are generating a hypothetical document for infomation retrieval.
    Do not answer  the user directly.
    Generate a short hypothetical passage that could contain
the information needed to answer the question.
 Question : ${question}
`;

  const result = await model.invoke(PromptGenerate);
  return result.content;
};
// hypotheticGenerate();
