# ScamScore Calculation Process

The **ScamShield** ScamScore is calculated using a multi-layered approach that combines AI-driven language analysis with real-time technical security checks.

## 1. Data Collection & Preprocessing
- **Text Analysis**: Combines the user's description with text extracted from uploaded images (via OCR).
- **Normalization**: Converts all text to lowercase for consistent keyword detection.

## 2. AI Intuition (60% Base Weight)
The system uses an AI model (GPT-4o-mini) to analyze the "tone" and "context" of the message.
- **AI Score**: A value between 0 and 100 representing the AI's risk assessment.
- **Base Contribution**: `aiScore * 0.6` (Initial weight up to 60 points).

## 3. Technical Risk Factors (Additive "Extra Score")
Automated checks add points based on high-risk signals:

| Risk Factor | Points Added | Rationale |
| :--- | :--- | :--- |
| **OTP Request** | **+40** | Asking for OTPs via chat/SMS is a major red flag. |
| **Known Scammer** | **+40** | Contact information matches the blacklist database. |
| **Google Safe Browsing** | **+30** | Domain is blacklisted by Google for phishing/malware. |
| **Domain Age (<30 days)** | **+15** | Newly registered domains are higher risk. |
| **VirusTotal Flags** | **+5 per engine** | Points for each security engine that flags the URL as malicious. |

## 4. Final Calculation
The final score is the sum of the AI base and technical flags, capped at 100.

> **`ScamScore = Math.min(100, (AIScore * 0.6) + ExtraScore)`**

---

### Example Scenario:
A message with suspicious language (AI Score: 80) that asks for an OTP (+40) but has no other flags:
- **Base Score**: `80 * 0.6 = 48`
- **Technical Flags**: `+40`
- **Total**: `48 + 40 = 88` (High Risk)
