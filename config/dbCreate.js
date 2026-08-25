import { QdrantSetup } from "./qdrantSetup.js"; 
export const createVectordb = async()=>{
 try{
    await QdrantSetup.createCollection("MultiPdfStore",{
        vectors: {
            size: 3072,
            distance: "Cosine"
        }
    })
    await QdrantSetup.createPayloadIndex("MultiPdfStore", {
        field_name: "userId",
        field_schema : "keyword"
    })
 await QdrantSetup.createPayloadIndex("MultiPdfStore", {
        field_name: "documentId",
        field_schema : "keyword"
    })

 }catch(error){
    throw error;
 }
}
createVectordb();