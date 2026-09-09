import { parentStore } from "./createParent.js";

export const uploadDocument = async (req, res) => {
  const file = req.file;
  console.log(file)
  const result = await parentStore(file);
  res.status(200).json({
    success: 200,
    message: "file upload successfully",
    data: result,
  });
};
