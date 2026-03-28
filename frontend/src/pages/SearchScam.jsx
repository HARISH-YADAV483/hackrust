import { useState } from "react";
import axios from "../api/axiosInstance";
import "../Common.css";

const SearchScam = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const search = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const res = await axios.get(`/scams/search?query=${query}`);
      setResults(res.data);
    } catch (err) {
      console.error("Search failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container-center" style={{ minHeight: "calc(100vh - 80px)", justifyContent: "flex-start" }}>
      <header className="auth-header" style={{ marginBottom: "3rem" }}>
        <h2>🔍 Intelligence Database</h2>
        <p>Search verified scams by keyword, platform, or details</p>
      </header>

      <div className="card-glass" style={{ maxWidth: "800px", marginBottom: "3rem", padding: "1.5rem" }}>
        <div style={{ display: "flex", gap: "1rem" }}>
          <input
            className="input-field"
            placeholder="Search by OTP, WhatsApp, UPI, keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && search()}
          />
          <button onClick={search} className="btn-primary" style={{ width: "150px", marginTop: "0" }}>
            {loading ? "..." : "Search"}
          </button>
        </div>
      </div>

      <div style={{ width: "100%", maxWidth: "1000px", display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "1.5rem" }}>
        {results.map((r) => (
          <div key={r._id} className="card-glass" style={{ maxWidth: "none", display: "flex", flexDirection: "column", padding: "1.5rem" }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "1rem" }}>
              <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", padding: "4px 8px", borderRadius: "6px", color: "var(--primary)" }}>{r.platform}</span>
              <span style={{ fontWeight: "800", color: r.scamScore > 70 ? "var(--error)" : "var(--warning)" }}>{r.scamScore} Score</span>
            </div>
            <h3 style={{ fontSize: "1.2rem", marginBottom: "0.75rem" }}>{r.title}</h3>
            <p style={{ fontSize: "0.9rem", color: "var(--text-muted)", flexGrow: 1, marginBottom: "1.5rem" }}>{r.description.substring(0, 120)}...</p>
            <div style={{ borderTop: "1px solid rgba(255,255,255,0.05)", pt: "1rem", fontSize: "0.85rem", color: "var(--primary)" }}>
              Contact: <span style={{ color: "#fff" }}>{r.contact}</span>
            </div>
          </div>
        ))}
        {results.length === 0 && !loading && query && (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", color: "var(--text-muted)" }}>No matches found in our records.</div>
        )}
      </div>
    </div>
  );
};

export default SearchScam;