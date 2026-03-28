import { useState } from "react";
import { createReport } from "../api/reportApi";

const ReportScam = () => {
  const [form, setForm] = useState({
    description: "",
    contact: "",
    domain: "",
    file: null,
  });

  const [result, setResult] = useState(null);

  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await createReport(form, token);
      setResult(res);
    } catch (err) {
      console.error(err);
      alert("Error submitting report");
    }
  };

  return (
    <div style={{ padding: "20px", maxWidth: "800px", margin: "auto" }}>
      <h2>🚨 Report & Analyze Scam</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <textarea
          placeholder="Describe the scam in detail..."
          required
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />
<input
  placeholder="Scam Title (e.g. Lottery Scam)"
  required
  onChange={(e) =>
    setForm({ ...form, title: e.target.value })
  }
/>

<input
  placeholder="Platform (WhatsApp, UPI, Instagram...)"
  required
  onChange={(e) =>
    setForm({ ...form, platform: e.target.value })
  }
/>
        <input
          placeholder="Scammer Contact (phone/email)"
          required
          onChange={(e) =>
            setForm({ ...form, contact: e.target.value })
          }
        />

        <input
          placeholder="Website domain (optional)"
          onChange={(e) =>
            setForm({ ...form, domain: e.target.value })
          }
        />

        <input
          type="file"
          accept="image/*,.pdf"
          onChange={(e) =>
            setForm({ ...form, file: e.target.files[0] })
          }
        />

        <button type="submit">Analyze Scam</button>
      </form>

      {/* RESULT */}
      {result && (
        <div style={{ marginTop: "30px" }}>
          <h2>📊 Scam Score: {result.scamScore}/100</h2>

          {/* 🧠 TEXT ANALYSIS */}
          <div style={{ border: "2px solid red", padding: "10px", marginTop: "10px" }}>
            <h3>🧠 Text Analysis</h3>
            {result.textFlags?.length ? (
              <ul>
                {result.textFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p>No issues detected</p>
            )}
          </div>

          {/* 🌐 URL ANALYSIS */}
          <div style={{ border: "2px solid orange", padding: "10px", marginTop: "10px" }}>
            <h3>🌐 URL Detection</h3>
            {result.urlFlags?.length ? (
              <ul>
                {result.urlFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p>No issues detected</p>
            )}
          </div>

          {/* ⚠️ OTHER FLAGS */}
          <div style={{ border: "2px solid purple", padding: "10px", marginTop: "10px" }}>
            <h3>⚠️ Other Alerts</h3>
            {result.otherFlags?.length ? (
              <ul>
                {result.otherFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p>No issues detected</p>
            )}
          </div>

          {/* 🟢 GREEN FLAGS */}
          <div style={{ border: "2px solid green", padding: "10px", marginTop: "10px" }}>
            <h3>🟢 Safe Signals</h3>
            {result.greenFlags?.length ? (
              <ul>
                {result.greenFlags.map((flag, i) => (
                  <li key={i}>{flag}</li>
                ))}
              </ul>
            ) : (
              <p>No positive signals</p>
            )}
          </div>

          {/* 📌 NEXT STEPS */}
          <div style={{ marginTop: "20px" }}>
            <h3>📌 What You Should Do</h3>
            <ul>
              {result.nextSteps?.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportScam;