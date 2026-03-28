import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: String,
    email: {
      type: String,
      unique: true,
    },
    password: String,

    profilePic: {
      type: String,
      default: "",
    },

    reportsCount: {
      type: Number,
      default: 0,
    },

    questionsCount: {
      type: Number,
      default: 0,
    },
    blogsCount: {
      type: Number,
      default: 0,
    },
    role: {
  type: String,
  enum: ["user", "admin"],
  default: "user",
},
simulator: {
  easyCompleted: { type: Number, default: 0 },
  mediumCompleted: { type: Number, default: 0 },
  hardCompleted: { type: Number, default: 0 },
  score: { type: Number, default: 0 },
},
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);