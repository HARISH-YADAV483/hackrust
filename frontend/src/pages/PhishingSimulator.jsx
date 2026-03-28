import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axiosInstance";

const PhishingSimulator = () => {
  const navigate = useNavigate();
  const [level, setLevel] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [result, setResult] = useState(null);

  const user = JSON.parse(localStorage.getItem("userInfo"));
  const token = user?.token;

  useEffect(() => {
    if (!token) {
      navigate("/login");
    }
  }, [token, navigate]);
  const startLevel = (lvl) => {
    if (lvl === "medium" && user?.simulator?.easyCompleted < 100) {
      alert("⚠️ Complete Easy level first");
      return;
    }

    if (lvl === "hard" && user?.simulator?.mediumCompleted < 50) {
      alert("⚠️ Complete Medium level first");
      return;
    }

    setLevel(lvl);
  };

  // 📥 Fetch Questions
  useEffect(() => {
    if (!level) return;

    const fetchQuestions = async () => {
      const res = await axios.get(`/simulator/${level}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setQuestions(res.data);
    };

    fetchQuestions();
  }, [level]);

  // ✅ Submit Answer
  const handleAnswer = async (option) => {
    const q = questions[currentIndex];

    const res = await axios.post(
      "/simulator/answer",
      {
        questionId: q._id,
        selectedAnswer: option,
      },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    setResult(res.data);
  };

  const nextQuestion = () => {
    setResult(null);
    setCurrentIndex((prev) => prev + 1);
  };

  // 🟡 LEVEL SELECT SCREEN
  if (!level) {
    return (
      <div style={{ padding: "20px" }}>
        <h2>🎯 Phishing Simulator</h2>

        <button onClick={() => startLevel("easy")}>Easy</button>

        <button
          onClick={() => startLevel("medium")}
          disabled={user?.simulator?.easyCompleted < 100}
        >
          Medium 🔒
        </button>

        <button
          onClick={() => startLevel("hard")}
          disabled={user?.simulator?.mediumCompleted < 50}
        >
          Hard 🔒
        </button>
      </div>
    );
  }

  if (!questions.length) return <p>Loading...</p>;

  const currentQ = questions[currentIndex];

  return (
    <div style={{ display: "flex", height: "100vh" }}>
      {/* 🔢 LEFT: QUESTION GRID */}
      <div
        style={{
          width: "25%",
          borderRight: "2px solid #ccc",
          padding: "10px",
          overflowY: "auto",
        }}
      >
        <h3>Questions</h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "10px" }}>
          {questions.map((_, i) => (
            <button
              key={i}
              onClick={() => {
                setCurrentIndex(i);
                setResult(null);
              }}
              style={{
                background: i === currentIndex ? "orange" : "#eee",
                padding: "10px",
              }}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>

      {/* 🧠 RIGHT: QUESTION */}
      <div style={{ width: "75%", padding: "20px" }}>
        <h3>Level: {level.toUpperCase()}</h3>

        {/* Scenario */}
        {currentQ.scenario && (
          <div style={{ marginBottom: "15px", background: "#f5f5f5", padding: "10px" }}>
            <p><strong>From:</strong> {currentQ.scenario.senderName}</p>
            <p><strong>Email:</strong> {currentQ.scenario.senderEmail}</p>
            <p><strong>Subject:</strong> {currentQ.scenario.subject}</p>
            <p>{currentQ.scenario.message}</p>
          </div>
        )}

        {/* Question */}
        <h4>{currentQ.question}</h4>

        {/* Options */}
        <div style={{ marginTop: "10px" }}>
          {currentQ.options.map((opt, i) => (
            <button
              key={i}
              onClick={() => handleAnswer(opt)}
              disabled={result !== null}
              style={{
                display: "block",
                margin: "10px 0",
                padding: "10px",
                width: "100%",
              }}
            >
              {opt}
            </button>
          ))}
        </div>

        {/* RESULT */}
        {result && (
          <div style={{ marginTop: "20px" }}>
            <h3>
              {result.isCorrect ? "✅ Correct" : "❌ Incorrect"}
            </h3>

            <p><strong>Correct Answer:</strong> {result.correctAnswer}</p>

            <p><strong>Explanation:</strong> {result.explanation}</p>

            <h4>🚨 Red Flags</h4>
            <ul>
              {result.redFlags.map((f, i) => (
                <li key={i}>{f}</li>
              ))}
            </ul>

            <p>Points Earned: {result.points}</p>

            {/* NEXT BUTTON */}
            {currentIndex < questions.length - 1 && (
              <button onClick={nextQuestion}>Next</button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default PhishingSimulator;