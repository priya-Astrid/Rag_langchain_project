import { pdfUploadService } from "../services/pdfUpoadService.js";

export const pdfUpload = async(req, res)=>{
   try{
    const result = await pdfUploadService(req.file);
    res.status(200).json({
        success: true,
        message: "pdf upload successfully",
        documentId: result
    })
   }
   catch(error){
    res.status(500).json({
        success: false,
        message: error.message
    })
   }
}