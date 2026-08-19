import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

export const pdfUploadService = async (pdf) => {
  const loader = new PDFLoader(pdf.path);
  const docs = await loader.load();

  const spliiter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });

  const chunks = await spliiter.splitDocuments(docs);

  const text = chunks.map((chunk) => chunk.pageContent);
  console.log(text.length);

  const embeddingModel = generateEmbedding();
  const vector = await embeddingModel.embedDocuments(text);
  console.log("response", vector);
  //   chunks, embedModel

  const points = vector.map((embedding, index) => ({
    id: index + 1,
    vector: embedding,
    payload: {
      text: chunks[index].pageContent,
      metadata: chunks[index].metadata,
    },
  }));
  const storeVector = await QdrantSetup.upsert("document", {
    wait: true,
    points,
  });
 
};
