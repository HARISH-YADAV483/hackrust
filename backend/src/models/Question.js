import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
  level: {
    type: String,
    enum: ["easy", "medium", "hard"],
  },
  format: String,
  category: String,

  scenario: Object,

  question: String,
  options: [String],
  correctAnswer: String,
  explanation: String,

  redFlags: [String],
});

export default mongoose.model("Question", questionSchema);