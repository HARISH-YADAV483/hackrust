import { useEffect, useState } from "react";
import axios from "../api/axiosInstance";

const Leaderboard = () => {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const fetch = async () => {
      const res = await axios.get("/leaderboard");
      setUsers(res.data);
    };

    fetch();
  }, []);

  return (
    <div>
      <h2>🏆 Leaderboard</h2>

      {users.map((u, i) => (
        <div key={i}>
          <p>{u.name}</p>
          <p>Score: {u.simulator.score}</p>
          <p>
            Progress: {u.simulator.easyCompleted}/100 |{" "}
            {u.simulator.mediumCompleted}/50 |{" "}
            {u.simulator.hardCompleted}/50
          </p>
        </div>
      ))}
    </div>
  );
};

export default Leaderboard;