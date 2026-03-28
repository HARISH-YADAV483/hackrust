import { useState } from "react";
import { createReport } from "../api/reportApi";
import "./ReportScam.css";

const ReportScam = () => {
  const [form, setForm] = useState({
    title: "",
    platform: "",
    description: "",
    contact: "",
    domain: "",
    file: null,
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await createReport(form, token);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    } finally {
      setLoading(false);
    }
  };

  const getScoreColor = (score) => {
    if (score >= 80) return "#ef4444";
    if (score >= 50) return "#f59e0b";
    return "#10b981";
  };

  return (
    <div className="report-container">
      <div className="report-header">
        <h1> Report & Analyze Scam</h1>
        <p>Submit suspicious activity for our AI-powered security engine to analyze.</p>
      </div>

      <form onSubmit={handleSubmit} className="scam-form">
        <div className="input-group">
          <label>Scam Title</label>
          <input
            placeholder="e.g. Amazon Lottery SMS"
            required
            onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Platform</label>
          <input
            placeholder="WhatsApp, UPI, Instagram..."
            required
            onChange={(e) => setForm({ ...form, platform: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Scammer Detail</label>
          <input
            placeholder="Phone number, email, or username"
            required
            onChange={(e) => setForm({ ...form, contact: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Website URL (optional)</label>
          <input
            placeholder="https://scam-site.com"
            onChange={(e) => setForm({ ...form, domain: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Detailed Description</label>
          <textarea
            placeholder="Explain how the scam happened or exactly what the message says in detail. This helps our AI provide a more accurate analysis..."
            required
            rows="10"
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
        </div>

        <div className="input-group">
          <label>Attach Evidence (Screenshot/PDF)</label>
          <div className="file-input-wrapper" onClick={() => document.getElementById('file-upload').click()}>
            <span>{form.file ? form.file.name : "📁 Click to upload or drag evidence"}</span>
            <input
              id="file-upload"
              type="file"
              hidden
              accept="image/*,.pdf"
              onChange={(e) => setForm({ ...form, file: e.target.files[0] })}
            />
          </div>
        </div>

        <button type="submit" className="analyze-btn" disabled={loading}>
          {loading ? "Analyzing System..." : "🛡️ Analyze Scam Now"}
        </button>
      </form>

      {result && (
        <div className="results-container">
          <div className="score-display">
            <div className="score-circle" style={{ borderColor: getScoreColor(result.scamScore) }}>
              <span className="score-number" style={{ color: getScoreColor(result.scamScore) }}>
                {result.scamScore}
              </span>
              <span className="score-label">ScamScore</span>
            </div>
            <p>Risk Level: {result.scamScore >= 80 ? "Critical" : result.scamScore >= 50 ? "High" : "Low/Moderate"}</p>
          </div>

          <div className="flags-grid">
            <div className="alert-card risk-high">
              <h3>🧠 AI Text Analysis</h3>
              {result.textFlags?.length ? (
                <ul>
                  {result.textFlags.map((flag, i) => (
                    <li key={i}>🚩 {flag}</li>
                  ))}
                </ul>
              ) : (
                <p>✅ No verbal red flags detected</p>
              )}
            </div>

            <div className="alert-card risk-medium">
              <h3>🌐 Digital Footprint</h3>
              {result.urlFlags?.length ? (
                <ul>
                  {result.urlFlags.map((flag, i) => (
                    <li key={i}>🔗 {flag}</li>
                  ))}
                </ul>
              ) : (
                <p>✅ Clear URL signals</p>
              )}
            </div>

            <div className="alert-card risk-neutral">
              <h3>⚠️ Intelligence Alerts</h3>
              {result.otherFlags?.length ? (
                <ul>
                  {result.otherFlags.map((flag, i) => (
                    <li key={i}>🔹 {flag}</li>
                  ))}
                </ul>
              ) : (
                <p>✅ No external database matches</p>
              )}
            </div>

            <div className="alert-card risk-low">
              <h3>🟢 Safe Signals</h3>
              {result.greenFlags?.length ? (
                <ul>
                  {result.greenFlags.map((flag, i) => (
                    <li key={i}>⭐ {flag}</li>
                  ))}
                </ul>
              ) : (
                <p>No positive signals found</p>
              )}
            </div>

            <div className="next-steps-card">
              <h3>📌 Recommended Actions</h3>
              <div className="steps-list">
                {result.nextSteps?.map((step, i) => (
                  <div key={i} className="step-item">
                    {i + 1}. {step}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScam;