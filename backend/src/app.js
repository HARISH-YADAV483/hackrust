import express from "express";
import cors from "cors";
import reportRoutes from "./routes/reportRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import path from "path";
import adminRoutes from "./routes/adminRoutes.js";
import scamRoutes from "./routes/scamRoutes.js";
import leaderboardRoutes from "./routes/leaderboardRoutes.js";
import simulatorRoutes from "./routes/simulatorRoutes.js";
import BlogRoutes from "./routes/BlogRoutes.js";


const app = express();


const allowedOrigins = process.env.FRONTEND_URL
  ? [process.env.FRONTEND_URL, "http://localhost:5173"]
  : ["http://localhost:5173"];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);


app.use(express.json());

// routes
app.use("/api/reports", reportRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/uploads", express.static("uploads"));

app.use("/api/admin", adminRoutes);

app.get("/", (req, res) => {
  res.send("API is running...");
});
app.use("/api/scams", scamRoutes);
// import bcrypt from "bcryptjs";

// const run = async () => {
//   const password = "asd";

//   const hashed = await bcrypt.hash(password, 10);

//   console.log("HASH:", hashed);
// };

// run();
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/simulator", simulatorRoutes);
app.use("/api/blogs", BlogRoutes);
export default app;