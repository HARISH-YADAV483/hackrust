import React, { useState, useEffect } from "react";
import "../Common.css";

const Tools = () => {
    // Password Strength Checker State
    const [password, setPassword] = useState("");
    const [strength, setStrength] = useState({
        score: 0,
        label: "Very Weak",
        color: "#ef4444",
        feedback: []
    });

    // Password Generator State
    const [keyword, setKeyword] = useState("");
    const [number, setNumber] = useState("");
    const [generatedPassword, setGeneratedPassword] = useState("");
    const [copySuccess, setCopySuccess] = useState("");

    const calculateStrength = (pwd) => {
        let score = 0;
        let feedback = [];

        if (pwd.length === 0) {
            return { score: 0, label: "Very Weak", color: "#ef4444", feedback: [] };
        }

        if (pwd.length < 8) {
            feedback.push("At least 8 characters required");
        } else {
            score += 1;
        }

        if (/[A-Z]/.test(pwd)) score += 1;
        else feedback.push("Include an uppercase letter");

        if (/[0-9]/.test(pwd)) score += 1;
        else feedback.push("Include a number");

        if (/[!@#$%^&*(),.?":{}|<>]/.test(pwd)) score += 1;
        else feedback.push("Include a special character");

        if (pwd.length >= 12) score += 1;

        let label = "Very Weak";
        let color = "#ef4444";
        if (score === 2) { label = "Weak"; color = "#f97316"; }
        else if (score === 3) { label = "Medium"; color = "#eab308"; }
        else if (score === 4) { label = "Strong"; color = "#22c55e"; }
        else if (score >= 5) { label = "Very Strong"; color = "#10b981"; }

        return { score, label, color, feedback };
    };

    useEffect(() => {
        setStrength(calculateStrength(password));
    }, [password]);

    const generateStrongPassword = () => {
        const symbols = "!@#$%^&*";
        const randomChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";
        const randomNums = "0123456789";

        let base = keyword.trim() || "Pass";
        let numPart = number.trim() || Math.floor(Math.random() * 90 + 10).toString();
        
        // Ensure some complexity if keywords are simple
        let randomPart = "";
        for (let i = 0; i < 3; i++) {
            randomPart += randomChars.charAt(Math.floor(Math.random() * randomChars.length));
        }
        let sym = symbols.charAt(Math.floor(Math.random() * symbols.length));

        // Format: Keyword + Sym + Random + Num
        const newPwd = `${base}${sym}${randomPart}${numPart}`;
        setGeneratedPassword(newPwd);
        setCopySuccess("");
    };

    const copyToClipboard = () => {
        navigator.clipboard.writeText(generatedPassword);
        setCopySuccess("Copied!");
    };

    return (
        <div className="container-center" style={{ gap: "2rem", alignItems: "flex-start", flexDirection: "row", flexWrap: "wrap", justifyContent: "center" }}>
            <div className="auth-header" style={{ width: "100%", textAlign: "center" }}>
                <h2> Security Tools</h2>
                <p>Enhance your digital safety with our essential utilities</p>
            </div>

            {/* Password Strength Checker */}
            <div className="card-glass" style={{ flex: "1 1 400px", maxWidth: "500px" }}>
                <h3 style={{ color: "white", marginBottom: "1.5rem" }}>🧩 Strength Checker</h3>
                <div className="form-group">
                    <label>Test your password</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="Enter password..."
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </div>

                <div style={{ marginTop: "1rem" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
                        <span style={{ fontSize: "0.85rem", color: "#cbd5e1" }}>Strength:</span>
                        <span style={{ fontSize: "0.85rem", fontWeight: "bold", color: strength.color }}>{strength.label}</span>
                    </div>
                    <div style={{ 
                        height: "8px", 
                        background: "rgba(255,255,255,0.1)", 
                        borderRadius: "10px", 
                        overflow: "hidden" 
                    }}>
                        <div style={{ 
                            width: `${(strength.score / 5) * 100}%`, 
                            height: "100%", 
                            background: strength.color,
                            transition: "width 0.3s ease"
                        }}></div>
                    </div>
                </div>

                {strength.feedback.length > 0 && password.length > 0 && (
                    <ul style={{ marginTop: "1rem", paddingLeft: "1.2rem", color: "#94a3b8", fontSize: "0.85rem" }}>
                        {strength.feedback.map((f, i) => <li key={i}>{f}</li>)}
                    </ul>
                )}
            </div>

            {/* Password Generator */}
            <div className="card-glass" style={{ flex: "1 1 400px", maxWidth: "500px" }}>
                <h3 style={{ color: "white", marginBottom: "1.5rem" }}>⚡ Password Generator</h3>
                <div className="form-group">
                    <label>Keyword (Optional)</label>
                    <input 
                        type="text" 
                        className="input-field" 
                        placeholder="e.g. MyCat, Summer"
                        value={keyword}
                        onChange={(e) => setKeyword(e.target.value)}
                    />
                </div>
                <div className="form-group">
                    <label>Favorite Number (Optional)</label>
                    <input 
                        type="number" 
                        className="input-field" 
                        placeholder="e.g. 2024, 7"
                        value={number}
                        onChange={(e) => setNumber(e.target.value)}
                    />
                </div>
                <button className="btn-primary" onClick={generateStrongPassword}>Generate Strong Password</button>

                {generatedPassword && (
                    <div style={{ marginTop: "2rem", background: "rgba(15, 23, 42, 0.4)", padding: "1.5rem", borderRadius: "12px", border: "1px solid rgba(255,255,255,0.1)" }}>
                        <div style={{ fontSize: "0.8rem", color: "#94a3b8", marginBottom: "0.5rem" }}>Your Strong Password:</div>
                        <div style={{ 
                            display: "flex", 
                            alignItems: "center", 
                            justifyContent: "space-between", 
                            gap: "1rem" 
                        }}>
                            <code style={{ 
                                fontSize: "1.1rem", 
                                color: "#10b981", 
                                wordBreak: "break-all",
                                background: "rgba(16, 185, 129, 0.1)",
                                padding: "0.5rem",
                                borderRadius: "4px"
                            }}>{generatedPassword}</code>
                            <button 
                                onClick={copyToClipboard}
                                style={{ 
                                    background: "rgba(255,255,255,0.1)", 
                                    border: "none", 
                                    color: "white", 
                                    padding: "0.5rem 1rem", 
                                    borderRadius: "8px",
                                    cursor: "pointer",
                                    whiteSpace: "nowrap"
                                }}
                            >
                                {copySuccess || "Copy"}
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Tools;
