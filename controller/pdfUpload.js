import { pdfUploadService } from "../services/pdfUpoadService.js";

export const pdfUpload = async(req, res)=>{
   try{
    const userId ="priya123";
    const pdfs = req.files;
  
    
  console.log("this esponse", pdfs, userId);
    const result = await pdfUploadService(pdfs, userId);
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