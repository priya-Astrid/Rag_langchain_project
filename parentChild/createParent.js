import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import { generateEmbedding } from "../config/createEmbedding.js";
import { QdrantSetup } from "../config/qdrantSetup.js";

export const parentStore = async (pdf) => {
  console.log("response", pdf);
  const loader = new PDFLoader(pdf.path);
  const docs = await loader.load();

  // parent chunk
  const parentSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 300,
    chunkOverlap: 50,
  });

  const parentDoc = await parentSplitter.splitDocuments(docs);
  const parents = parentDoc.map((doc, index) => ({
    parentId: `parent-${index + 1}`,
    text: doc.pageContent,
  }));
  // child chunk
  const childSplitter = new RecursiveCharacterTextSplitter({
    chunkSize: 200,
    chunkOverlap: 50,
  });
  const children = [];
  
  for (const parent of parents) {

    const childDocs = await childSplitter.createDocuments([
      parent.text
    ]);

    childDocs.forEach((child, index) => {

      children.push({
        childId: `${parent.parentId}-child-${index + 1}`,
        parentId: parent.parentId,
        text: child.pageContent,
      });

    });
  }

  //3. child Embedding
  const embedModel = generateEmbedding();
  const vector = await embedModel.embedDocuments(
    children.map((child) => child.text),
  );
  // 4. qdrant points
  const points = vector.map((embedding, index) => ({
    id: crypto.randomUUID(),
    vector: embedding,
    payload: {
      parentId: children[index].parentId,
      childId: children[index].childId,
      filename: pdf.originalname,
      chunkIndex: index,
      text: children[index].pageContent,
    },
  }));
  await QdrantSetup.upsert("ChildPdfStore", {
    wait: true,
    points,
  });
  console.log("PARENTS:", parents);
  return { parents, children };
};

// import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";
// import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

// export const parentStore = async (pdf) => {
//   console.log("response", pdf);
//   const loader = new PDFLoader(pdf.path);
//   const docs = await loader.load();

//   const parentSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 300,
//     chunkOverlap: 50,
//   });

//   const parentDoc = await parentSplitter.splitDocuments(docs);
//   const parents = parentDoc.map((doc, index) => ({
//     parentId: `parent-${index + 1}`,
//     text: doc.pageContent,
//   }));
//   const childSplitter = new RecursiveCharacterTextSplitter({
//     chunkSize: 200,
//     chunkOverlap: 50,
//   });
//   const children = [];
//   for (const parent of parents) {
//     const childDocs = await childSplitter.createDocuments([parent.text]);
//     console.log(childDocs);

//     childDocs.forEach((child, index) => {
//       children.push({
//         childId: `${parent.parentId}-child-${index + 1}`,
//         parentId: parent.parentId,
//         text: child.pageContent,
//       });
//     });
//   }
//   console.log("PARENTS:", parents);
//   console.log("CHILDREN:", children);
//   return { parents, children };
// };
