import Report from "../models/Report.js";
import Scammer from "../models/Scammer.js";
import User from "../models/User.js";

import { analyzeText } from "../services/aiService.js";
import { extractTextFromImage } from "../services/ocrService.js";
import { checkDomain } from "../services/domainService.js";
import { getDomainAge } from "../services/whoisService.js";
import { generateScamScore } from "../services/scamScoreService.js";

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
    let aiData = {};

    try {
      const aiResult = await analyzeText(fullText);
      aiData = JSON.parse(aiResult) || {};
    } catch (err) {
      console.log("⚠️ AI parsing failed, using fallback");
      aiData = {};
    }

    // 🔍 Check scammer dataset
    const cleanContact = (contact || "").trim();
    console.log("🔍 Searching scammer DB for contact:", JSON.stringify(cleanContact));

    // Case-insensitive, trimmed exact match
    const scammer = cleanContact
      ? await Scammer.findOne({
          contact: { $regex: new RegExp(`^${cleanContact.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}$`, "i") },
        })
      : null;

    console.log("🔍 Scammer match result:", scammer ? `FOUND → ${scammer.name || scammer.contact}` : "NOT FOUND");
    const isScammerMatch = !!scammer;

    // 🌐 Domain check
    const domainResult = domain ? await checkDomain(domain) : null;

    let vtMalicious = 0;
    let googleFlag = false;
    let tldRisk = 0;
    let tldFlag = null;

    if (domainResult?.vt?.data) {
      vtMalicious =
        domainResult.vt.data.attributes.last_analysis_stats.malicious || 0;
    }

    if (domainResult?.google?.matches) {
      googleFlag = true;
    }

    // Manual TLD check result (from domainService)
    if (domainResult?.tld) {
      tldRisk = domainResult.tld.tldRisk ?? 0;
      tldFlag = domainResult.tld.flag ?? null;
    }

    // 📅 Domain age
    let domainAge = null;
    if (domain) {
      domainAge = await getDomainAge(domain);
    }

    // 🎯 Run scoring engine
    const scoreResult = generateScamScore({
      aiData,
      fullText,
      vtMalicious,
      googleFlag,
      domainAge,
      isScammerMatch,
      hasDomain: !!domain,
      tldRisk,
      tldFlag,
    });

    // 💾 Save report
    const report = await Report.create({
      user: req.user._id,
      title,
      platform,
      description,
      contact,
      domain,
      extractedText,
      scamScore: scoreResult.scamScore,
      scammerAlert: scoreResult.scammerAlert,   // ⚠️ standalone high-alert flag
      severity: scoreResult.severity,
      confidence: scoreResult.confidence,
      scamType: scoreResult.scamType,
      textFlags: scoreResult.textFlags,
      urlFlags: scoreResult.urlFlags,
      otherFlags: scoreResult.otherFlags,
      greenFlags: scoreResult.greenFlags,
      nextSteps: scoreResult.nextSteps,
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