import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";
import "../Common.css";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios.get("/leaderboard");
        setUsers(res.data);
      } catch (err) {
        console.error("Failed to fetch leaderboard");
      }
    };
    fetch();
  }, []);

  return (
    <div className="container-center" style={{ minHeight: "calc(100vh - 80px)", justifyContent: "flex-start" }}>
      <header className="auth-header" style={{ marginBottom: "3rem" }}>
        <h2>🏆 Hall of Heroes</h2>
        <p>Top protectors in the ScamShield community</p>
      </header>

      <div style={{ width: "100%", maxWidth: "800px", display: "flex", flexDirection: "column", gap: "1rem" }}>
        {users.map((u, i) => (
          <div key={i} className="card-glass" style={{ 
            maxWidth: "none", 
            padding: "1.5rem 2rem", 
            display: "flex", 
            alignItems: "center", 
            justifyContent: "space-between",
            background: i === 0 ? "rgba(99, 102, 241, 0.2)" : i === 1 ? "rgba(168, 85, 247, 0.15)" : "rgba(30, 41, 59, 0.4)",
            borderColor: i === 0 ? "var(--primary)" : i === 1 ? "var(--accent)" : "rgba(255,255,255,0.1)"
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "1.5rem" }}>
              <div style={{ 
                fontSize: "1.5rem", 
                fontWeight: "800", 
                color: i === 0 ? "#fbbf24" : i === 1 ? "#94a3b8" : i === 2 ? "#b45309" : "#475569",
                minWidth: "30px"
              }}>
                {i + 1}
              </div>
              <div>
                <div style={{ fontWeight: "700", fontSize: "1.1rem" }}>{u.name}</div>
                <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>
                  Lvl: {u.simulator?.easyCompleted >= 100 ? (u.simulator?.mediumCompleted >= 50 ? "Hard Protec" : "Med Guard") : "Recruit"}
                </div>
              </div>
            </div>

            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "1.4rem", fontWeight: "800", color: "var(--primary)" }}>{u.simulator?.score || 0}</div>
              <div style={{ fontSize: "0.75rem", textTransform: "uppercase", letterSpacing: "1px", color: "var(--text-muted)" }}>Points</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Leaderboard;