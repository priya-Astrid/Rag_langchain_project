// manual context compression practice

import { contextCompressor } from "./contextCompression.js";

const question = "What is MongoDB";
const document = `Mongodb is Nosql database. 
MongoDb store data in Bson format,
MongoDB supports replication.
MongoDB provides indexing.`;

export const practiceData = async() =>{

    const finalResponse = await contextCompressor(question, document)
    
    console.log("finalResponse", finalResponse);
}
practiceData();