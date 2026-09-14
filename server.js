import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
import { connectMongodb } from "./config/mongodb.js";
dotenv.config();
const PORT = process.env.PORT;
const server = http.createServer(app);

export const serverStart = async () => {
  await connectMongodb();
  server.listen(PORT, () => {
    console.log(`server is running on ${PORT}`);
  });
};

serverStart();