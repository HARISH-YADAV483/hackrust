import mongoose from "mongoose";
import dotenv from "dotenv";
import Question from "./src/models/Question.js";

dotenv.config();

const questions = [
  {
    level: "easy",
    format: "email",
    category: "phishing",
    scenario: {
      senderName: "Netflix Support",
      senderEmail: "support@netflex-billing.com",
      subject: "Your subscription is about to expire",
      message: "Dear user, your payment method has failed. Please update your billing information immediately to avoid service interruption: http://netflex-billing.com/update",
    },
    question: "Is this email a scam?",
    options: ["Yes, it looks like phishing", "No, it seems legitimate"],
    correctAnswer: "Yes, it looks like phishing",
    explanation: "The sender email domain 'netflex-billing.com' is a typo of 'netflix.com' (typosquatting). Official Netflix emails come from netflix.com.",
    redFlags: ["Misspelled domain (netflex instead of netflix)", "Urgent/Threatening tone", "Suspicious link"],
  },
  {
    level: "easy",
    format: "sms",
    category: "smishing",
    scenario: {
      senderName: "Unknown",
      senderEmail: "+1-800-123-4567",
      subject: "Security Alert",
      message: "Someone tried to log into your Amazon account from a new device. If this wasn't you, please verify here: http://bit.ly/secure-my-account",
    },
    question: "What is the main red flag in this message?",
    options: ["The shortened URL (bit.ly)", "The phone number", "The grammar"],
    correctAnswer: "The shortened URL (bit.ly)",
    explanation: "Large companies like Amazon rarely use generic link shorteners like bit.ly for critical security alerts.",
    redFlags: ["Shortened URL", "Generic security warning"],
  },
  {
    level: "easy",
    format: "email",
    category: "phishing",
    scenario: {
      senderName: "HR Department",
      senderEmail: "hr@company-internal-records.com",
      subject: "Mandatory Policy Update",
      message: "Please review the updated employee handbook and sign the acknowledgement form by the end of the day: http://company-internal-records.com/policy",
    },
    question: "How can you verify if this is legitimate?",
    options: ["Check with HR via a known internal channel", "Click the link and see if it looks professional", "Reply to the email and ask for confirmation"],
    correctAnswer: "Check with HR via a known internal channel",
    explanation: "Always verify unexpected requests through established, trusted communication channels (e.g., Slack, company portal, or in-person).",
    redFlags: ["Suspicious domain name", "Urgency"],
  }
];

const seedDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    await Question.deleteMany({});
    console.log("Cleared old questions");

    await Question.insertMany(questions);
    console.log("Seeded initial questions");

    mongoose.connection.close();
  } catch (err) {
    console.error(err);
  }
};

seedDB();
