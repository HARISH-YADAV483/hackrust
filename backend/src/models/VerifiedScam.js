import mongoose from "mongoose";

const verifiedScamSchema = new mongoose.Schema(
  {
    description: String,
    contact: String,
    domain: String,
    scamScore: Number,
    textFlags: [String],
    urlFlags: [String],
    otherFlags: [String],
  },
  { timestamps: true }
);

export default mongoose.model("VerifiedScam", verifiedScamSchema);