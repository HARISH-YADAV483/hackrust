import express from "express";
import {
  getPendingReports,
  approveReport,
  rejectReport,
} from "../controllers/adminController.js";

import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";

const router = express.Router();

router.get("/reports", protect, adminOnly, getPendingReports);
router.put("/approve/:id", protect, adminOnly, approveReport);
router.put("/reject/:id", protect, adminOnly, rejectReport);

export default router;