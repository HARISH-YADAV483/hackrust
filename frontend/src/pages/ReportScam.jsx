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
    return "#22c55e";
  };

  const getRiskLabel = (score) => {
    if (score >= 80) return "Critical";
    if (score >= 50) return "High";
    return "Low / Moderate";
  };

  return (
    <div className="report-page">

      {/* ── Page header ─────────────────────────────────────── */}
      <div className="report-page-header">
        <span className="report-badge">AI-Powered Analysis</span>
        <h1>Report &amp; Analyze Scam</h1>
        <p>Submit suspicious activity for our security engine to dissect and score.</p>
      </div>

      {/* ── Two-column landscape layout (> 1024 px) ─────────── */}
      <div className="report-landscape">

        {/* LEFT — form panel */}
        <div className="report-form-panel">
          <div className="panel-label">
            <span className="panel-dot" />
            Submit Evidence
          </div>

          <form onSubmit={handleSubmit} className="scam-form">
            <div className="form-row">
              <div className="input-group">
                <label>Scam Title</label>
                <input
                  placeholder="e.g. Amazon Lottery SMS"
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Platform</label>
                <input
                  placeholder="WhatsApp, UPI, Instagram…"
                  onChange={(e) => setForm({ ...form, platform: e.target.value })}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="input-group">
                <label>Scammer Detail</label>
                <input
                  placeholder="Phone number, email, or username"
                  onChange={(e) => setForm({ ...form, contact: e.target.value })}
                />
              </div>
              <div className="input-group">
                <label>Website URL <span className="optional">(optional)</span></label>
                <input
                  placeholder="https://scam-site.com"
                  onChange={(e) => setForm({ ...form, domain: e.target.value })}
                />
              </div>
            </div>

            <div className="input-group full-width">
              <label>Detailed Description</label>
              <textarea
                placeholder="Explain how the scam happened or exactly what the message says in detail. This helps our AI provide a more accurate analysis…"
                rows="7"
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />
            </div>

            <div className="input-group full-width">
              <label>Attach Evidence <span className="optional">(Screenshot / PDF)</span></label>
              <div className="file-input-wrapper" onClick={() => document.getElementById("file-upload").click()}>
                <span className="file-icon">📁</span>
                <span>{form.file ? form.file.name : "Click to upload or drag evidence here"}</span>
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
              {loading ? (
                <><span className="spinner" /> Analyzing…</>
              ) : (
                <>🛡️ Analyze Scam Now</>
              )}
            </button>
          </form>
        </div>

        {/* RIGHT — results / idle panel */}
        <div className="report-results-panel">
          <div className="panel-label">
            <span className="panel-dot results-dot" />
            Analysis Results
          </div>

          {!result ? (
            <div className="idle-state">
              <div className="idle-icon">🔍</div>
              <p className="idle-title">Awaiting Submission</p>
              <p className="idle-sub">Fill in the form and click Analyze to see your AI-powered scam report here.</p>
              <ul className="idle-features">
                <li>🧠 AI Text Analysis</li>
                <li>🌐 Domain & URL Inspection</li>
                <li>🗃️ Scam Database Lookup</li>
                <li>📌 Recommended Next Steps</li>
              </ul>
            </div>
          ) : (
            <div className="results-container">

              {/* ── Scammer High Alert Banner ── */}
              {result.scammerAlert && (
                <div style={{
                  background: "linear-gradient(135deg, rgba(220,38,38,0.25), rgba(185,28,28,0.15))",
                  border: "1px solid rgba(239,68,68,0.6)",
                  borderRadius: "12px",
                  padding: "1rem 1.25rem",
                  marginBottom: "1rem",
                  display: "flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  boxShadow: "0 0 20px rgba(239,68,68,0.2)"
                }}>
                  <span style={{ fontSize: "1.5rem" }}>🚨</span>
                  <div>
                    <strong style={{ color: "#ef4444", fontSize: "1rem", display: "block" }}>
                      HIGH ALERT — Known Scammer Detected
                    </strong>
                    <span style={{ color: "#fca5a5", fontSize: "0.85rem" }}>
                      This contact matches a verified entry in our scammer database.
                    </span>
                  </div>
                </div>
              )}

              {/* Score circle */}
              <div className="score-display">
                <div className="score-circle" style={{ borderColor: getScoreColor(result.scamScore) }}>
                  <span className="score-number" style={{ color: getScoreColor(result.scamScore) }}>
                    {result.scamScore}
                  </span>
                  <span className="score-label">ScamScore</span>
                </div>
                <p className="risk-tag" style={{ color: getScoreColor(result.scamScore) }}>
                  Risk Level: <strong>{getRiskLabel(result.scamScore)}</strong>
                </p>
              </div>

              <div className="flags-grid">
                <div className="alert-card risk-high">
                  <h3>🧠 AI Text Analysis</h3>
                  {result.textFlags?.length ? (
                    <ul>{result.textFlags.map((f, i) => <li key={i}>🚩 {f}</li>)}</ul>
                  ) : <p>✅ No verbal red flags detected</p>}
                </div>

                <div className="alert-card risk-medium">
                  <h3>🌐 Digital Footprint</h3>
                  {result.urlFlags?.length ? (
                    <ul>{result.urlFlags.map((f, i) => <li key={i}>🔗 {f}</li>)}</ul>
                  ) : <p>✅ Clear URL signals</p>}
                </div>

                <div className="alert-card risk-neutral">
                  <h3>⚠️ Intelligence Alerts</h3>
                  {(result.scammerAlert || result.otherFlags?.length) ? (
                    <ul>
                      {result.scammerAlert && (
                        <li key="scammer" style={{ color: "#ef4444", fontWeight: "600" }}>
                          🚨 Contact matches known scammer database
                        </li>
                      )}
                      {result.otherFlags?.map((f, i) => <li key={i}>🔹 {f}</li>)}
                    </ul>
                  ) : <p>✅ No database matches</p>}
                </div>

                <div className="alert-card risk-low">
                  <h3>🟢 Safe Signals</h3>
                  {result.greenFlags?.length ? (
                    <ul>{result.greenFlags.map((f, i) => <li key={i}>⭐ {f}</li>)}</ul>
                  ) : <p>No positive signals found</p>}
                </div>

                <div className="next-steps-card">
                  <h3>📌 Recommended Actions</h3>
                  <div className="steps-list">
                    {result.nextSteps?.map((step, i) => (
                      <div key={i} className="step-item">{i + 1}. {step}</div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ReportScam;