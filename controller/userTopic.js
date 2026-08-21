import { userAskQuestion } from "../services/usertopicService.js";

export const userTopicData = async (req, res) => {
  try {
    const question =req.body.question ;
    const documentId = req.body.documentId;
    const userId = "priya123";
    const result = await userAskQuestion(question,documentId, userId);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });

console.error("ERROR DATA:", error);
  }
};
