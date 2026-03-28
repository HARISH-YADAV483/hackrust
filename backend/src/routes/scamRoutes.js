import express from "express";
import { searchScams } from "../controllers/scamController.js";

const router = express.Router();

// 🔍 search route
router.get("/search", searchScams);

export default router;