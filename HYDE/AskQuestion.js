import { generateEmbedding } from "../config/createEmbedding.js";
import { generateContentAI } from "../config/generateContent.js";
import { QdrantSetup } from "../config/qdrantSetup.js";
import { hypotheticGenerate } from "./hypotheticFirstCode.js";

export const HypotheAnswer = async () => {
  const model = generateContentAI();
  const question = "What is a collection in MongoDB?";
  const hypoQuestion = await hypotheticGenerate(question);
  const EmbedModel = generateEmbedding();
  const hypotheticEmbed = await EmbedModel.embedQuery(hypoQuestion);
  console.log("run");
  const relevant = await QdrantSetup.query("MultiPdfStore", {
    query: hypotheticEmbed,
    limit: 2,
    with_payload: true,
  });
  console.log("relevant :", relevant);

  const relevantDocument = relevant.points
    .filter((item) => item.score >= 0.5)
    .map((point) => ({
      score: point.score,
      text: point.payload.text,
    }));
  console.log("finalResult :", relevantDocument);
  const context = relevantDocument.map((doc) => doc.text).join("\n\n");
  console.log("context", context);

  const prompt = `
You are a helpful assistant.

Answer the user's question using ONLY the information provided in the context.

Context:
${context}

User Question:
${question}

Instructions:
- If the answer is present in the context, answer it directly.
- Do not say "I don't know" if the context contains the answer.
- If the answer is not present in the context, say:
"I don't know based on the provided context."
`;
  const final = await model.invoke(prompt);
  console.log("final reponse", final.content);
};
HypotheAnswer();
