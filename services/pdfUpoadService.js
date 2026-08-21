import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

export const pdfUploadService = async (pdf) => {

  if(!pdf){
      throw new Error("PDF file Required");
  }
  const loader = new PDFLoader(pdf.path);
  const docs = await loader.load();

  const documentId = crypto.randomUUID();
  
  const spliiter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });

  
  const chunks = await spliiter.splitDocuments(docs);
  
  const text = chunks.map((chunk) => chunk.pageContent);
 
  const embeddingModel = generateEmbedding();
  const vector = await embeddingModel.embedDocuments(text, documentId);
   // //   chunks, embedModel

  const points = vector.map((embedding, index) => ({
    id: crypto.randomUUID(),
    vector: embedding,
    payload: {
      documentId,
      filename: pdf.originalname,
      chunkIndex: index,
      text: chunks[index].pageContent,
      metadata: chunks[index].metadata,
    },
  }));
  const storeVector = await QdrantSetup.upsert("document", {
    wait: true,
    points,
  });
 
  console.log(storeVector);
   return documentId;
};
