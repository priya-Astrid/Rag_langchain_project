import { userAskQuestion } from "../services/usertopicService.js";

export const userTopicData = async (req, res) => {
  try {
    const result = await userAskQuestion(req.body.question);
    res.status(200).json({
      success: true,
      message: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
