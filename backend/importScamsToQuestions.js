import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./src/models/Question.js";

dotenv.config();

const seedFromScams = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const VerifiedScam = mongoose.connection.db.collection("verifiedscams");
    const scams = await VerifiedScam.find({}).toArray();
    console.log(`Found ${scams.length} verified scams`);

    const questions = scams.map((s) => {
      // Map levels: beginner->easy, medium->medium, pro->hard
      let level = "easy";
      if (s.level === "medium") level = "medium";
      if (s.level === "pro") level = "hard";

      return {
        level,
        format: s.format || "email",
        category: s.category || "phishing",
        scenario: s.scenario || {
          senderName: "Unknown",
          senderEmail: s.contact || "",
          subject: "Urgent Security Alert",
          message: s.description || "",
        },
        question: s.question || "Is this a scam?",
        options: s.options || ["Yes", "No"],
        correctAnswer: s.correctAnswer || "Yes",
        explanation: s.explanation || "This exhibits common scam patterns.",
        redFlags: s.redFlags || [],
      };
    });

    await Question.deleteMany({});
    console.log("Cleared old questions");

    await Question.insertMany(questions);
    console.log(`Successfully imported ${questions.length} questions`);

    mongoose.connection.close();
  } catch (err) {
    console.error("Import failed:", err);
    process.exit(1);
  }
};

seedFromScams();
