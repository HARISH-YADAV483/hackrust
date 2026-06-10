import axios from "axios";

export const analyzeText = async (text) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openrouter/auto",

        messages: [
          {
            role: "system",
            content: `You are a scam detection expert. Analyze text for fraud indicators and return a structured JSON assessment. Be precise with your risk scoring:
- 0-20: Clearly legitimate/safe
- 21-40: Minor concerns, likely safe
- 41-60: Suspicious, needs caution
- 61-80: High risk, likely a scam
- 81-100: Almost certainly a scam`
          },
          {
            role: "user",
            content: `Analyze this text for scam indicators.

Return ONLY valid JSON:

{
  "scamType": "one of: phishing, financial, identity, lottery, job, investment, impersonation, urgency, unknown",
  "riskScore": 0,
  "confidence": "one of: low, medium, high",
  "redFlags": ["list of specific red flags found in the text"],
  "greenFlags": ["list of legitimacy indicators found"],
  "urgencyTactics": ["any pressure or urgency language detected"],
  "summary": "2-3 sentence analysis summary"
}

Text to analyze:
${text}`,
          },
        ],

        response_format: {
          type: "json_object",
        },
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.choices[0].message.content;

  } catch (error) {
    console.error(
      "AI Error:",
      error.response?.data || error.message
    );

    return JSON.stringify({
      scamType: "unknown",
      riskScore: 50,
      confidence: "low",
      redFlags: [],
      greenFlags: [],
      urgencyTactics: [],
      summary: "AI analysis was unable to process this request."
    });
  }
};