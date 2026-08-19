import { QdrantSetup } from "./qdrantSetup.js"; 
export const createVectordb = async()=>{
 try{
    await QdrantSetup.createCollection("document",{
        vectors: {
            size: 3072,
            distance: "Cosine"
        }
    })
 }catch(error){
    throw error;
 }
}
createVectordb();