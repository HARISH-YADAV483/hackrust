import Report from "../models/Report.js";
import Scammer from "../models/Scammer.js";
import User from "../models/User.js";

import { analyzeText } from "../services/aiService.js";
import { extractTextFromImage } from "../services/ocrService.js";
import { checkDomain } from "../services/domainService.js";
import { getDomainAge } from "../services/whoisService.js";

export const createReport = async (req, res) => {
  try {
    const { title, platform, description, contact, domain } = req.body;

    let extractedText = "";

    // 🧾 OCR (if file uploaded)
    if (req.file) {
      extractedText = await extractTextFromImage(req.file.path);
    }

    const fullText = (description + " " + extractedText).toLowerCase();

    // 🤖 AI analysis
    let aiScore = 50; // fallback
    let aiData = {};

    try {
      const aiResult = await analyzeText(fullText);
      aiData = JSON.parse(aiResult);
      aiScore = aiData.score || 50;
    } catch (err) {
      console.log("⚠️ AI parsing failed, using fallback");
    }

    // 🔍 Check scammer dataset
    const scammer = await Scammer.findOne({ contact });
    const isScammerMatch = !!scammer;

    // 🌐 Domain check
    const domainResult = domain ? await checkDomain(domain) : null;

    let vtMalicious = 0;
    let googleFlag = false;

    if (domainResult?.vt?.data) {
      vtMalicious =
        domainResult.vt.data.attributes.last_analysis_stats.malicious || 0;
    }

    if (domainResult?.google?.matches) {
      googleFlag = true;
    }

    // 🚩 FLAG CATEGORIES
    let textFlags = [...(aiData.redFlags || [])];
    let urlFlags = [];
    let otherFlags = [];
    let greenFlags = [...(aiData.greenFlags || [])];

    let extraScore = 0;

    //domain age 
    let domainAge = null;

if (domain) {
  domainAge = await getDomainAge(domain);

  if (domainAge !== null && domainAge < 30) {
    urlFlags.push("🚨 Domain is newly created (less than 3 months old)");
    extraScore += 15;
  }
}

    // 🔴 OTP DETECTION
    if (fullText.includes("otp")) {
      textFlags.push(
        "⚠️ Asking for OTP — No legitimate app or website asks for OTP"
      );
      extraScore += 40;
    }

    // 🔴 SCAMMER MATCH
    if (isScammerMatch) {
      otherFlags.push("🚨 Contact matches known scammer database");
      extraScore += 40;
    }


    // 🔴 VIRUSTOTAL ENGINE FLAGS
    if (vtMalicious > 0) {
      urlFlags.push(
        `🚨 ${vtMalicious} security engines flagged this domain as malicious`
      );
      extraScore += vtMalicious * 5;
    }

    // 🔴 GOOGLE SAFE BROWSING
    if (googleFlag) {
      urlFlags.push("🚨 Google Safe Browsing detected phishing/malware");
      extraScore += 30;
    }

    // 🟢 GREEN FLAGS
    if (!googleFlag && vtMalicious === 0 && domain) {
      greenFlags.push("✅ Domain appears safe");
    }

    // 🎯 FINAL SCORE
    const scamScore = Math.min(100, aiScore * 0.6 + extraScore);

    // 📌 Next steps
    const nextSteps = [
      "Do not send money",
      "Report to cybercrime portal",
      "Block the contact",
    ];

    // 💾 Save report
    const report = await Report.create({
  user: req.user._id,

  title,
  platform,

  description,
  contact,
  domain,
  extractedText,
  scamScore,

  textFlags,
  urlFlags,
  otherFlags,
  greenFlags,

  nextSteps,
});

    // 👤 update user report count
    if (!req.user) {
      console.error("❌ Auth Error: User not found");
      return res.status(401).json({ message: "Not authorized" });
    }

    await User.findByIdAndUpdate(req.user._id, {
      $inc: { reportsCount: 1 },
    });

    res.json(report);
  } catch (error) {
    console.error("❌ Create Report Error:", error);
    res.status(500).json({ message: error.message });
  }
};