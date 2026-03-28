import axios from "axios";

export const checkDomain = async (domain) => {
  let vtData = {};
  let googleData = {};

  try {
    // VirusTotal
    const vt = await axios.get(
      `https://www.virustotal.com/api/v3/domains/${domain}`,
      {
        headers: {
          "x-apikey": process.env.VIRUSTOTAL_API_KEY,
        },
      }
    );
    vtData = vt.data;
  } catch (error) {
    console.error("❌ VirusTotal API Error:", error.response ? error.response.data : error.message);
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

  return {
    vt: vtData,
    google: googleData,
  };
};