import { useState } from "react";
import axios from "../api/axiosInstance";

const SearchScam = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const search = async () => {
    const res = await axios.get(`/scams/search?query=${query}`);
    setResults(res.data);
  };

  return (
    <div>
      <h2>🔍 Search Scams</h2>

      <input
        placeholder="Search by OTP, WhatsApp, UPI..."
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={search}>Search</button>

      {results.map((r) => (
        <div key={r._id} style={{ border: "1px solid", margin: "10px" }}>
          <h3>{r.title}</h3>
          <p>Platform: {r.platform}</p>
          <p>{r.description}</p>
          <p>Score: {r.scamScore}</p>
        </div>
      ))}
    </div>
  );
};

export default SearchScam;