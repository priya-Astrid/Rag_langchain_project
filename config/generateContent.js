import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const geminiModel = "gemini-3-flash-preview";
export const generateContentAI =  () => {
   return new ChatGoogleGenerativeAI({
      model: "gemini-3-flash-preview",
       apiKey: process.env.GENAI_SECRET_KEYS,
    });
};
