import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

export const pdfUploadService = async (pdfs, userId) => {
  console.log("this is response", pdfs, userId);
  const result = [];
  for (const pdf of pdfs) {
    const documentId = crypto.randomUUID();

    if (!pdf) {
      throw new Error("PDF file Required");
    }
    const loader = new PDFLoader(pdf.path);
    const docs = await loader.load();

    const spliiter = new RecursiveCharacterTextSplitter({
      chunkSize: 200,
      chunkOverlap: 50,
    });

    const chunks = await spliiter.splitDocuments(docs);

    const text = chunks.map((chunk) => chunk.pageContent);

    const embeddingModel = generateEmbedding();
    const vector = await embeddingModel.embedDocuments(text);
   
    const points = vector.map((embedding, index) => ({
      id: crypto.randomUUID(),
      vector: embedding,
      payload: {
        documentId,
        userId,
        filename: pdf.originalname,
        chunkIndex: index,
        text: chunks[index].pageContent,
        metadata: chunks[index].metadata,
      },
    }));
     await QdrantSetup.upsert("MultiPdfStore", {
      wait: true,
      points,
    });

    result.push(documentId);
  }
  return result;
};
