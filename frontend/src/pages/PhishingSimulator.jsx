import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";
import "../Common.css";

const PhishingSimulator = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  useEffect(() => {
    if (!token) navigate("/login");
  }, [token, navigate]);

  const startLevel = (lvl) => {
    if (lvl === "medium" && user?.simulator?.easyCompleted < 100) return alert("⚠️ Complete Easy level first");
    if (lvl === "hard" && user?.simulator?.mediumCompleted < 50) return alert("⚠️ Complete Medium level first");
    setLevel(lvl);
  };

  useEffect(() => {
    if (!level) return;
    const fetchQuestions = async () => {
      const res = await axios.get(`/simulator/${level}`, { headers: { Authorization: `Bearer ${token}` } });
      setQuestions(res.data);
    };
    fetchQuestions();
  }, [level]);

  const handleAnswer = async (option) => {
    const q = questions[currentIndex];
    const res = await axios.post("/simulator/answer", { questionId: q._id, selectedAnswer: option }, { headers: { Authorization: `Bearer ${token}` } });
    setResult(res.data);
  };

  const nextQuestion = () => {
    setResult(null);
    setCurrentIndex((prev) => prev + 1);
  };

  if (!level) {
    return (
      <div className="container-center">
        <div className="card-glass" style={{ maxWidth: "600px", textAlign: "center" }}>
          <header className="auth-header">
            <h2>🎯 Phishing Simulator</h2>
            <p>Select your training level to begin</p>
          </header>
          <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            <button onClick={() => startLevel("easy")} className="btn-primary">Easy Level</button>
            <button onClick={() => startLevel("medium")} className="btn-primary" disabled={user?.simulator?.easyCompleted < 100} style={{ background: user?.simulator?.easyCompleted < 100 ? "#334155" : "linear-gradient(135deg, #a855f7, #7c3aed)" }}>
              Medium Level {user?.simulator?.easyCompleted < 100 && "🔒"}
            </button>
            <button onClick={() => startLevel("hard")} className="btn-primary" disabled={user?.simulator?.mediumCompleted < 50} style={{ background: user?.simulator?.mediumCompleted < 50 ? "#334155" : "linear-gradient(135deg, #ec4899, #be185d)" }}>
              Hard Level {user?.simulator?.mediumCompleted < 50 && "🔒"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!questions.length) return <div className="container-center"><p>Loading simulation...</p></div>;

  const currentQ = questions[currentIndex];

  return (
    <div style={{ display: "flex", height: "calc(100vh - 80px)", overflow: "hidden" }}>
      {/* 🔢 SIDEBAR: QUESTION MAP */}
      <div style={{ width: "300px", background: "rgba(15, 23, 42, 0.8)", borderRight: "1px solid var(--glass-border)", padding: "1.5rem", overflowY: "auto" }}>
        <h3 style={{ marginBottom: "1.5rem", fontSize: "1.1rem", color: "var(--primary)" }}>Simulation Map</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "0.75rem" }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => { setCurrentIndex(i); setResult(null); }}
              style={{
                width: "100%", aspectRation: "1", borderRadius: "8px", border: "1px solid var(--glass-border)",
                background: i === currentIndex ? "var(--primary)" : "rgba(30, 41, 59, 0.6)",
                color: "#fff", fontWeight: "700", cursor: "pointer"
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 🧠 MAIN AREA: CONTENT */}
      <div style={{ flexGrow: 1, padding: "2rem", overflowY: "auto", position: "relative" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
          <h2 style={{ fontSize: "1.5rem" }}>{level.toUpperCase()} Simulation</h2>
          <span style={{ color: "var(--text-muted)" }}>Question {currentIndex + 1} of {questions.length}</span>
        </div>

        <div className="card-glass" style={{ maxWidth: "none", marginBottom: "2rem" }}>
          {currentQ.scenario && (
            <div style={{ marginBottom: "2rem", background: "rgba(15, 23, 42, 0.5)", border: "1px solid var(--glass-border)", borderRadius: "12px", padding: "1.5rem" }}>
              <div style={{ display: "grid", gridTemplateColumns: "80px 1fr", gap: "0.5rem", fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: "1rem" }}>
                <span>From:</span> <span style={{ color: "#fff", fontWeight: "600" }}>{currentQ.scenario.senderName} ({currentQ.scenario.senderEmail})</span>
                <span>Subject:</span> <span style={{ color: "var(--primary)", fontWeight: "600" }}>{currentQ.scenario.subject}</span>
              </div>
              <p style={{ lineHeight: "1.6", color: "#e2e8f0" }}>{currentQ.scenario.message}</p>
            </div>
          )}

          <h3 style={{ marginBottom: "1.5rem" }}>{currentQ.question}</h3>

          <div style={{ display: "grid", gap: "1rem" }}>
            {currentQ.options.map((opt, i) => (
              <button
                key={i} onClick={() => handleAnswer(opt)} disabled={result !== null}
                className="btn-primary"
                style={{ 
                  textAlign: "left", padding: "1rem 1.5rem", background: result ? (opt === result.correctAnswer ? "var(--success)" : "rgba(30, 41, 59, 0.6)") : "rgba(15, 23, 42, 0.6)",
                  border: "1px solid var(--glass-border)", opacity: result && opt !== result.correctAnswer ? 0.5 : 1
                }}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>

        {result && (
          <div className="card-glass" style={{ maxWidth: "none", background: result.isCorrect ? "rgba(16, 185, 129, 0.1)" : "rgba(239, 68, 68, 0.1)", borderColor: result.isCorrect ? "var(--success)" : "var(--error)" }}>
            <h3 style={{ color: result.isCorrect ? "var(--success)" : "var(--error)", marginBottom: "1rem" }}>
              {result.isCorrect ? "✅ Correct! Great eye." : "❌ This was a scam attempt."}
            </h3>
            <p style={{ marginBottom: "1.5rem", lineHeight: "1.6" }}>{result.explanation}</p>
            
            <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem", marginBottom: "2rem" }}>
              {result.redFlags.map((f, i) => (
                <span key={i} style={{ background: "rgba(239, 68, 68, 0.2)", color: "#fca5a5", padding: "4px 10px", borderRadius: "20px", fontSize: "0.8rem" }}>🚩 {f}</span>
              ))}
            </div>

            {currentIndex < questions.length - 1 ? (
              <button onClick={nextQuestion} className="btn-primary" style={{ width: "auto", px: "2rem" }}>Proceed to Next Question →</button>
            ) : (
              <button onClick={() => navigate("/")} className="btn-primary" style={{ width: "auto", px: "2rem" }}>simulation Complete! Back Home</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingSimulator;