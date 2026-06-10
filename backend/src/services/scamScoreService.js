
const WEIGHTS_WITH_DOMAIN = {
  ai: 0.50,
  textPatterns: 0.30,
  domainReputation: 0.12,
  domainAge: 0.08,
};

const WEIGHTS_NO_DOMAIN = {
  ai: 0.65,
  textPatterns: 0.35,
};


const SCAM_PATTERNS = [
  // Financial fraud
  { pattern: /\botp\b/i, severity: 85, flag: "⚠️ Asking for OTP — No legitimate service asks for your OTP", category: "financial" },
  { pattern: /\b(bank\s*transfer|wire\s*transfer|neft|rtgs|imps)\b/i, severity: 60, flag: "⚠️ Mentions bank/wire transfer — common in advance-fee scams", category: "financial" },
  { pattern: /\b(upi|paytm|phonepe|gpay|google\s*pay)\b/i, severity: 50, flag: "⚠️ Mentions UPI/payment apps — verify before transacting", category: "financial" },
  { pattern: /\b(credit\s*card|debit\s*card|card\s*number|cvv|expiry)\b/i, severity: 90, flag: "🚨 Asking for card details — never share card info via messages", category: "financial" },
  { pattern: /\b(gift\s*card|itunes\s*card|amazon\s*card|voucher)\b/i, severity: 80, flag: "🚨 Gift card payment request — classic scam tactic", category: "financial" },
  { pattern: /\b(crypto|bitcoin|ethereum|wallet\s*address|btc)\b/i, severity: 70, flag: "⚠️ Cryptocurrency payment request — often untraceable", category: "financial" },

  // Identity theft
  { pattern: /\b(kyc|know\s*your\s*customer|verify\s*identity|aadhaar|aadhar|pan\s*card|pan\s*number)\b/i, severity: 75, flag: "⚠️ KYC/identity verification request — may be phishing", category: "identity" },
  { pattern: /\b(ssn|social\s*security|passport\s*number)\b/i, severity: 90, flag: "🚨 Asking for government ID — high risk of identity theft", category: "identity" },
  { pattern: /\b(password|login\s*credentials|username\s*and\s*password)\b/i, severity: 85, flag: "🚨 Asking for login credentials — never share passwords", category: "identity" },

  // Urgency & pressure tactics
  { pattern: /\b(urgent|immediately|act\s*now|limited\s*time|expire|suspended|blocked|frozen)\b/i, severity: 55, flag: "⚠️ Uses urgency/pressure language — common manipulation tactic", category: "urgency" },
  { pattern: /\b(last\s*chance|final\s*warning|account\s*will\s*be|within\s*24\s*hours|within\s*48\s*hours)\b/i, severity: 65, flag: "⚠️ Deadline pressure — scammers create false urgency", category: "urgency" },

  // Prize & lottery scams
  { pattern: /\b(lottery|prize|winner|congratulations|you\s*(have\s*)?won|lucky\s*draw|jackpot)\b/i, severity: 80, flag: "🚨 Lottery/prize claim — classic advance-fee scam pattern", category: "lottery" },
  { pattern: /\b(claim\s*your|redeem|collect\s*your\s*(prize|reward|money))\b/i, severity: 75, flag: "⚠️ Prize redemption language — likely a scam", category: "lottery" },

  // Job & investment scams
  { pattern: /\b(work\s*from\s*home|earn\s*money|easy\s*money|guaranteed\s*income|daily\s*earning|part\s*time\s*job)\b/i, severity: 65, flag: "⚠️ Too-good-to-be-true job/income offer", category: "job" },
  { pattern: /\b(invest|double\s*your\s*money|high\s*returns|guaranteed\s*returns|profit\s*daily)\b/i, severity: 70, flag: "⚠️ Investment scheme with guaranteed returns — likely fraudulent", category: "investment" },

  // Impersonation
  { pattern: /\b(police|cbi|customs|income\s*tax|court\s*order|legal\s*action|arrest\s*warrant)\b/i, severity: 75, flag: "🚨 Impersonating authorities — government agencies don't contact via messages", category: "impersonation" },
  { pattern: /\b(rbi|reserve\s*bank|sebi)\b/i, severity: 70, flag: "⚠️ Claims to be from financial regulator — likely impersonation", category: "impersonation" },

  // Suspicious links & actions
  { pattern: /\b(click\s*(here|this\s*link|below)|download\s*app|install)\b/i, severity: 50, flag: "⚠️ Prompting to click links or install software", category: "phishing" },
  { pattern: /\b(bit\.ly|tinyurl|short\.link|t\.co)\b/i, severity: 55, flag: "⚠️ Contains shortened URL — may hide malicious destination", category: "phishing" },
];

// ── Domain Age Risk Tiers ──
const getDomainAgeScore = (ageInDays) => {
  if (ageInDays === null || ageInDays === undefined) return { score: 0, flag: null };
  if (ageInDays < 7) return { score: 95, flag: "🚨 Domain created within the last week — extremely suspicious" };
  if (ageInDays < 30) return { score: 80, flag: "🚨 Domain less than 1 month old — high risk" };
  if (ageInDays < 90) return { score: 60, flag: "⚠️ Domain less than 3 months old — moderate risk" };
  if (ageInDays < 180) return { score: 35, flag: "⚠️ Domain less than 6 months old — somewhat new" };
  if (ageInDays < 365) return { score: 15, flag: null }; // mild, no flag
  return { score: 0, flag: null }; // established domain
};

// ── Severity Label ──
const getSeverityLabel = (score) => {
  if (score >= 80) return "Critical";
  if (score >= 60) return "High Risk";
  if (score >= 40) return "Moderate";
  if (score >= 20) return "Low Risk";
  return "Safe";
};

// ── Confidence Level ──
const getConfidence = (signals) => {
  // Count how many signal sources actually provided data
  let activeSources = 0;
  if (signals.aiAvailable) activeSources++;
  if (signals.textPatternsChecked) activeSources++;
  if (signals.domainChecked) activeSources++;
  if (signals.domainAgeChecked) activeSources++;
  if (signals.scammerDbChecked) activeSources++;

  if (activeSources >= 4) return "high";
  if (activeSources >= 2) return "medium";
  return "low";
};

// ── Dynamic Next Steps ──
const generateNextSteps = (severity, scamType, flags) => {
  const steps = [];

  // Universal steps
  steps.push("Do not share any personal or financial information");

  if (severity === "Critical" || severity === "High Risk") {
    steps.push("Report this immediately on the National Cybercrime Portal (cybercrime.gov.in)");
    steps.push("Block the contact on all platforms");
    steps.push("Alert your bank if you shared any financial details");
  }

  if (severity === "Moderate") {
    steps.push("Report to cybercrime portal if suspicious");
    steps.push("Block the contact");
  }

  // Scam-type specific steps
  if (scamType === "financial" || scamType === "identity") {
    steps.push("Monitor your bank statements for unauthorized transactions");
    steps.push("Change passwords for any accounts you may have shared credentials for");
  }

  if (scamType === "phishing") {
    steps.push("Do not click any links from this source");
    steps.push("Clear browser data if you already visited the link");
  }

  if (scamType === "lottery" || scamType === "job" || scamType === "investment") {
    steps.push("Do not pay any advance fees or registration charges");
  }

  if (scamType === "impersonation") {
    steps.push("Verify by contacting the organization directly through their official website");
  }

  if (severity === "Low Risk" || severity === "Safe") {
    steps.push("Stay cautious — verify the sender's identity independently");
  }

  // Deduplicate and limit
  return [...new Set(steps)].slice(0, 6);
};

// ═══════════════════════════════════════════════════════════════
// 🎯 MAIN SCORING FUNCTION
// ═══════════════════════════════════════════════════════════════
export const generateScamScore = ({
  aiData,
  fullText,
  vtMalicious,
  googleFlag,
  domainAge,
  isScammerMatch,
  hasDomain,
  tldRisk,
  tldFlag,
}) => {
  // ── 1. AI Signal ──
  const aiScore = aiData?.riskScore ?? 50;
  const aiAvailable = !!(aiData?.riskScore);

  // ── 2. Text Pattern Analysis ──
  const matchedPatterns = [];
  let textPatternScore = 0;

  for (const { pattern, severity, flag, category } of SCAM_PATTERNS) {
    if (pattern.test(fullText)) {
      matchedPatterns.push({ flag, category, severity });
      textPatternScore = Math.max(textPatternScore, severity);
    }
  }

  // Boost score if multiple patterns match (compounding evidence)
  if (matchedPatterns.length >= 4) {
    textPatternScore = Math.min(100, textPatternScore + 15);
  } else if (matchedPatterns.length >= 2) {
    textPatternScore = Math.min(100, textPatternScore + 8);
  }

  // ── 3. Domain Reputation (only if URL/domain was provided) ──
  //    Sources: VirusTotal + Google Safe Browsing + Manual TLD check
  let domainReputationScore = 0;
  const domainFlags = [];

  if (hasDomain) {
    // 3a. Manual TLD check — seeds the base domain risk
    //     Suspicious TLD contributes up to ~25 pts (tldRisk * 0.30)
    //     Trusted/common TLDs contribute 0–1 pt — negligible
    const tldContribution = Math.round((tldRisk ?? 0) * 0.30);
    domainReputationScore = tldContribution;
    if (tldFlag) {
      domainFlags.push(tldFlag);
    }

    // 3b. VirusTotal — each malicious engine flag adds 12 pts
    if (vtMalicious > 0) {
      domainReputationScore = Math.min(100, domainReputationScore + vtMalicious * 12);
      domainFlags.push(`🚨 ${vtMalicious} security engine${vtMalicious > 1 ? 's' : ''} flagged this domain as malicious`);
    }

    // 3c. Google Safe Browsing — definitive phishing/malware signal
    if (googleFlag) {
      domainReputationScore = Math.min(100, domainReputationScore + 40);
      domainFlags.push("🚨 Google Safe Browsing detected phishing/malware");
    }

    domainReputationScore = Math.min(100, domainReputationScore);
  }

  // ── 4. Domain Age (only if URL/domain was provided) ──
  const domainAgeResult = hasDomain
    ? getDomainAgeScore(domainAge)
    : { score: 0, flag: null };

  if (hasDomain && domainAgeResult.flag) {
    domainFlags.push(domainAgeResult.flag);
  }

  // ── 5. Scammer DB match — NOT part of score, handled as a separate alert ──
  // isScammerMatch is passed through to the result as `scammerAlert` only.

  // ── Weighted Final Score — dynamic weights based on domain presence ──
  let weightedScore;
  if (hasDomain) {
    weightedScore =
      (aiScore * WEIGHTS_WITH_DOMAIN.ai) +
      (textPatternScore * WEIGHTS_WITH_DOMAIN.textPatterns) +
      (domainReputationScore * WEIGHTS_WITH_DOMAIN.domainReputation) +
      (domainAgeResult.score * WEIGHTS_WITH_DOMAIN.domainAge);
  } else {
    weightedScore =
      (aiScore * WEIGHTS_NO_DOMAIN.ai) +
      (textPatternScore * WEIGHTS_NO_DOMAIN.textPatterns);
  }

  const finalScore = Math.round(Math.min(100, Math.max(0, weightedScore)));

  // ── Build Flags ──
  const textFlags = [
    ...(aiData?.redFlags || []),
    ...matchedPatterns.map((p) => p.flag),
  ];

  const urlFlags = [...domainFlags];
  const otherFlags = [];

  // Scammer match is a standalone HIGH ALERT — not added to score
  const scammerAlert = !!isScammerMatch;

  const greenFlags = [...(aiData?.greenFlags || [])];

  if (hasDomain && !googleFlag && vtMalicious === 0) {
    greenFlags.push("✅ Domain passed security checks");
  }

  if (domainAge !== null && domainAge > 365) {
    greenFlags.push("✅ Domain is well-established (over 1 year old)");
  }

  if (!isScammerMatch) {
    greenFlags.push("✅ Contact not found in known scammer databases");
  }

  if (matchedPatterns.length === 0) {
    greenFlags.push("✅ No common scam language patterns detected");
  }

  // ── Determine primary scam type ──
  const detectedCategories = matchedPatterns.map((p) => p.category);
  const scamType = aiData?.scamType || detectedCategories[0] || "unknown";

  // ── Severity & Confidence ──
  const severity = getSeverityLabel(finalScore);
  const confidence = getConfidence({
    aiAvailable,
    textPatternsChecked: true,
    domainChecked: hasDomain,
    domainAgeChecked: hasDomain && domainAge !== null,
    scammerDbChecked: false, // not used in scoring
  });

  // ── Next Steps ──
  const nextSteps = generateNextSteps(severity, scamType, [...textFlags, ...urlFlags, ...otherFlags]);

  return {
    scamScore: finalScore,
    severity,
    confidence,
    scamType,
    scammerAlert,           // ⚠️ HIGH ALERT flag — separate from score
    textFlags: [...new Set(textFlags)],
    urlFlags: [...new Set(urlFlags)],
    otherFlags,
    greenFlags: [...new Set(greenFlags)],
    nextSteps,
  };
};