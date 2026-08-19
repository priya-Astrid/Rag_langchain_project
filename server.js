import app from "./app.js";
import http from "http";
import dotenv from "dotenv";
dotenv.config();
const PORT = process.env.PORT;
const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`server is running on ${PORT}`);
});
