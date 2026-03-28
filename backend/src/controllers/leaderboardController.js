import User from "../models/User.js";

// 🏆 Get Leaderboard
export const getLeaderboard = async (req, res) => {
  try {
    const users = await User.find({})
      .select("name simulator")
      .sort({ "simulator.score": -1 })
      .limit(10);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};