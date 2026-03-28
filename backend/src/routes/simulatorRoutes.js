import express from "express";
import {
  getQuestions,
  submitAnswer,
} from "../controllers/simulatorController.js";

import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/:level", protect, getQuestions);
router.post("/answer", protect, submitAnswer);

export default router;