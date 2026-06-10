import axios from "axios";



// Tier 1 — Trusted, well-established TLDs (risk: 0)
const TRUSTED_TLDS = new Set([
  ".com", ".org", ".net", ".edu", ".gov", ".mil", ".int",
]);

// Tier 2 — Common country/regional and legitimate newer TLDs (risk: 5)
const COMMON_TLDS = new Set([
  // India
  ".in", ".co.in", ".net.in", ".org.in", ".gov.in", ".nic.in", ".ac.in",
  // UK / Europe
  ".uk", ".co.uk", ".org.uk", ".me.uk", ".de", ".fr", ".it", ".es", ".nl", ".se", ".no", ".fi",
  // Asia-Pacific
  ".au", ".com.au", ".net.au", ".ca", ".jp", ".sg", ".nz", ".hk",
  // Americas
  ".us", ".mx", ".br", ".com.br", ".ar",
  // Developer / tech TLDs
  ".io", ".dev", ".app",
  // Common newer commercial TLDs
  ".tech", ".online", ".store", ".shop", ".info", ".biz",
  ".co", ".me", ".tv", ".fm", ".ai", ".cloud", ".digital",
]);

// Tier 3 — Suspicious TLDs frequently abused for phishing/scams/spam (risk: 85)
const SUSPICIOUS_TLDS = new Set([
  // Free / no-cost domains (Freenom etc.)
  ".tk", ".ml", ".ga", ".cf", ".gq",
  // Highly abused generic TLDs
  ".xyz", ".top", ".club", ".link", ".click",
  ".download", ".zip", ".review", ".country",
  ".kim", ".science", ".work", ".party", ".gdn",
  ".bid", ".loan", ".stream", ".win", ".racing",
  ".accountant", ".faith", ".date", ".trade", ".webcam",
  // Other commonly exploited
  ".pw", ".cc", ".ru.com", ".com.co", ".icu", ".vip",
  ".uno", ".rest", ".space", ".site", ".cyou",
]);

// ── Extract and classify the TLD of a domain ──
export const checkTLD = (domain) => {
  const clean = domain
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0]
    .split("?")[0];

  const parts = clean.split(".");
  if (parts.length < 2) {
    return { tldRisk: 50, tld: "", flag: "⚠️ Could not determine domain extension", category: "unknown" };
  }

  // Try compound TLD first (.co.in, .co.uk, .com.au, etc.)
  let tld = "";
  if (parts.length >= 3) {
    const compound = "." + parts.slice(-2).join(".");
    if (
      TRUSTED_TLDS.has(compound) ||
      COMMON_TLDS.has(compound) ||
      SUSPICIOUS_TLDS.has(compound)
    ) {
      tld = compound;
    } else {
      tld = "." + parts[parts.length - 1];
    }
  } else {
    tld = "." + parts[parts.length - 1];
  }

  if (TRUSTED_TLDS.has(tld)) {
    return { tldRisk: 0, tld, flag: null, category: "trusted" };
  }

  if (COMMON_TLDS.has(tld)) {
    return { tldRisk: 5, tld, flag: null, category: "common" };
  }

  if (SUSPICIOUS_TLDS.has(tld)) {
    return {
      tldRisk: 85,
      tld,
      flag: `🚨 Suspicious domain extension "${tld}" — frequently used in phishing and scam sites`,
      category: "suspicious",
    };
  }

  // Unknown TLD — not in any recognised list
  return {
    tldRisk: 40,
    tld,
    flag: `⚠️ Uncommon domain extension "${tld}" — not a standard registered extension`,
    category: "unknown",
  };
};

// ── Full domain check: VirusTotal + Google Safe Browsing + TLD ──
export const checkDomain = async (domain) => {
  let vtData = {};
  let googleData = {};

  const cleanDomain = domain
    .replace(/^https?:\/\//, "")
    .replace(/^www\./, "")
    .split("/")[0];

  try {
    // VirusTotal
    const vt = await axios.get(
      `https://www.virustotal.com/api/v3/domains/${cleanDomain}`,
      {
        headers: {
          "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        },
      }
    );
    vtData = vt.data;
  } catch (error) {
    if (error.response?.status === 404) {
      console.log(`ℹ️ VirusTotal: Domain ${cleanDomain} not found (likely clean or never scanned)`);
    } else {
      console.error("❌ VirusTotal API Error:", error.response ? error.response.data : error.message);
    }
  }

  try {
    // Google Safe Browsing
    const google = await axios.post(
      `https://safebrowsing.googleapis.com/v4/threatMatches:find?key=${process.env.GOOGLE_API_KEY}`,
      {
        threatInfo: {
          threatTypes: ["MALWARE", "SOCIAL_ENGINEERING"],
          platformTypes: ["ANY_PLATFORM"],
          threatEntryTypes: ["URL"],
          threatEntries: [{ url: `http://${domain}` }],
        },
      }
    );
    googleData = google.data;
  } catch (error) {
    console.error("❌ Google Safe Browsing API Error:", error.response ? error.response.data : error.message);
  }

  // Manual TLD classification
  const tldResult = checkTLD(domain);

  return {
    vt: vtData,
    google: googleData,
    tld: tldResult,
  };
};