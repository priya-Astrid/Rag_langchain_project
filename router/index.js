import express from "express";
import { userTopicData } from "../controller/userTopic.js";
import multer from "multer";
import { pdfUpload } from "../controller/pdfUpload.js";
const router = express.Router();

const upload = multer({dest:"upload/"});

router.post("/upload", upload.single("pdf"),pdfUpload );

router.post("/usertopic", userTopicData );
export default router;