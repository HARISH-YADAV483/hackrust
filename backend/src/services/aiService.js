import axios from "axios";

export const analyzeText = async (text) => {
  try {
    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-4o-mini",
        messages: [
          {
            role: "user",
            content: `Analyze this scam text. Return:
            - scam type
            - risk score (0-100)
            - red flags
            - green flags
            - summary
  
            Text: ${text}`,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.error("❌ AI Service Error:", error.response ? error.response.data : error.message);
    return "AI analysis currently unavailable due to service error or quota limits.";
  }
};