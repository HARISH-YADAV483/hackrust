import mongoose from "mongoose";

const scammerSchema = new mongoose.Schema({
  contact: String,
  name: String,
  type: String,
});

export default mongoose.model("Scammer", scammerSchema);