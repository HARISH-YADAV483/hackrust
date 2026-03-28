import mongoose from "mongoose";

const reportSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    description: String,
    contact: String,
    domain: String,

    extractedText: String,

    scamScore: Number,
    textFlags: [String],
urlFlags: [String],
otherFlags: [String],
greenFlags: [String],
 
    nextSteps: [String],

    isVerified: {
      type: Boolean,
      default: false,
    },
    status: {
  type: String,
  enum: ["pending", "approved", "rejected"],
  default: "pending",
},
title: String,
platform: String,
  },
  { timestamps: true }
);

export default mongoose.model("Report", reportSchema);