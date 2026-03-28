import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import "../Common.css";

const Admin = () => {
  const [reports, setReports] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [activeTab, setActiveTab] = useState("reports");
  const token = JSON.parse(localStorage.getItem("userInfo"))?.token;

  const fetchReports = async () => {
    try {
      const res = await axios.get("/admin/reports", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setReports(res.data);
    } catch (err) {
      console.error("Failed to fetch reports");
    }
  };

  const fetchBlogs = async () => {
    try {
      const res = await axios.get("/blogs/pending", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setBlogs(res.data);
    } catch (err) {
      console.error("Failed to fetch pending blogs");
    }
  };

  useEffect(() => {
    if (token) {
      fetchReports();
      fetchBlogs();
    }
  }, [token]);

  const approve = async (id) => {
    try {
      await axios.put(`/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Report Approved & Verified");
      fetchReports();
    } catch (err) {
      alert("Approval failed");
    }
  };

  const reject = async (id) => {
    try {
      await axios.put(`/admin/reject/${id}`, {}, { headers: { Authorization: `Bearer ${token}` } });
      alert("Report Rejected");
      fetchReports();
    } catch (err) {
      alert("Rejection failed");
    }
  };

  const approveBlog = async (id) => {
    try {
      await axios.put(`/blogs/status/${id}`, { status: "approved" }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Blog Approved");
      fetchBlogs();
    } catch (err) {
      alert("Blog approval failed");
    }
  };

  const rejectBlog = async (id) => {
    try {
      await axios.put(`/blogs/status/${id}`, { status: "rejected" }, { headers: { Authorization: `Bearer ${token}` } });
      alert("Blog Rejected");
      fetchBlogs();
    } catch (err) {
      alert("Blog rejection failed");
    }
  };

  return (
    <div className="container-center" style={{ minHeight: "calc(100vh - 80px)", justifyContent: "flex-start" }}>
      <header className="auth-header" style={{ marginBottom: "2rem" }}>
        <h2>🛡️ Command Center</h2>
        <p>Review and verify community scam reports and blogs</p>
      </header>

      <div style={{ display: "flex", gap: "1rem", marginBottom: "3rem" }}>
        <button 
          onClick={() => setActiveTab("reports")} 
          className={`btn-primary ${activeTab !== "reports" ? "btn-outline" : ""}`}
          style={{ width: "200px", background: activeTab === "reports" ? "var(--primary)" : "transparent" }}
        >
          Reports ({reports.length})
        </button>
        <button 
          onClick={() => setActiveTab("blogs")} 
          className={`btn-primary ${activeTab !== "blogs" ? "btn-outline" : ""}`}
          style={{ width: "200px", background: activeTab === "blogs" ? "var(--primary)" : "transparent" }}
        >
          Blogs ({blogs.length})
        </button>
      </div>

      <div style={{ width: "100%", maxWidth: "1000px", display: "flex", flexDirection: "column", gap: "1.5rem" }}>
        {activeTab === "reports" && reports.map((r) => (
          <div key={r._id} className="card-glass" style={{ maxWidth: "none", display: "grid", gridTemplateColumns: "1fr 250px", gap: "2rem", padding: "2rem", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", padding: "4px 10px", borderRadius: "20px", color: "var(--primary)", fontWeight: "700" }}>{r.platform}</span>
                <span style={{ fontSize: "0.75rem", background: r.scamScore > 70 ? "rgba(239, 68, 68, 0.2)" : "rgba(245, 158, 11, 0.2)", padding: "4px 10px", borderRadius: "20px", color: r.scamScore > 70 ? "var(--error)" : "var(--warning)", fontWeight: "700" }}>Score: {r.scamScore}</span>
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>{r.title || "Untitled Report"}</h3>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6" }}>{r.description}</p>
              <div style={{ marginTop: "1rem", fontSize: "0.85rem", color: "var(--text-muted)" }}>
                Contact: <span style={{ color: "#fff" }}>{r.contact}</span> | Reporter: <span style={{ color: "#fff" }}>{r.reporterName || "Anonymous"}</span>
              </div>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button onClick={() => approve(r._id)} className="btn-primary" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "0" }}>Verify Report</button>
              <button onClick={() => reject(r._id)} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--error)", color: "var(--error)", marginTop: "0" }}>Reject</button>
            </div>
          </div>
        ))}

        {activeTab === "reports" && reports.length === 0 && (
          <div className="card-glass" style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✅</div>
            <h3 style={{ color: "var(--text-muted)" }}>Queue Clear! No pending reports to review.</h3>
          </div>
        )}

        {activeTab === "blogs" && blogs.map((b) => (
          <div key={b._id} className="card-glass" style={{ maxWidth: "none", display: "grid", gridTemplateColumns: "1fr 250px", gap: "2rem", padding: "2rem", alignItems: "center" }}>
            <div>
              <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
                <span style={{ fontSize: "0.75rem", background: "rgba(99, 102, 241, 0.2)", padding: "4px 10px", borderRadius: "20px", color: "var(--primary)", fontWeight: "700" }}>BLOG POST</span>
                <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Author: <span style={{ color: "#fff" }}>{b.author?.name}</span></span>
              </div>
              <h3 style={{ fontSize: "1.3rem", marginBottom: "0.75rem" }}>{b.title}</h3>
              {b.image && (
                <img 
                  src={`http://localhost:5001/uploads/${b.image}`} 
                  alt={b.title} 
                  style={{ width: "100%", maxHeight: "200px", objectFit: "cover", borderRadius: "8px", marginBottom: "1rem" }}
                />
              )}
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", lineHeight: "1.6", whiteSpace: "pre-wrap" }}>{b.content.substring(0, 300)}...</p>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem" }}>
              <button onClick={() => approveBlog(b._id)} className="btn-primary" style={{ background: "linear-gradient(135deg, #10b981, #059669)", marginTop: "0" }}>Approve Blog</button>
              <button onClick={() => rejectBlog(b._id)} className="btn-primary" style={{ background: "transparent", border: "1px solid var(--error)", color: "var(--error)", marginTop: "0" }}>Reject</button>
            </div>
          </div>
        ))}

        {activeTab === "blogs" && blogs.length === 0 && (
          <div className="card-glass" style={{ textAlign: "center", padding: "4rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>✍️</div>
            <h3 style={{ color: "var(--text-muted)" }}>No pending blogs to review.</h3>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;