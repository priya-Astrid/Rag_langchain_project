import mongoose from "mongoose";

const parentSchema = new mongoose.Schema({
  parentId: {
    type: String,
    required: true,
    unique: true,
  },
  documentId: {
    type: String,
    required: true,
  },
  filename: {
    type: String,
    required: true,
  },
  text: {
    type: String,
    required: true,
  },
  metadata: {
    type: Object,
    default: {},
  },
});

export const Parent = mongoose.model("parent", parentSchema)