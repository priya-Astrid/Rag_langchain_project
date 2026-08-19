import express from "express";
import  router from "./router/index.js";
const app = express();

console.log("this is app content");
app.use(express.json());
app.use("/api/v1/", router);
export default app;
