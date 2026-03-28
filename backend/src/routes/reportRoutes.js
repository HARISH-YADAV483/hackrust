import express from "express";
import { createReport } from "../controllers/reportController.js";
import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router(); // ✅ declare first

// ✅ Protected route with file upload (image/pdf)
router.post("/", protect, upload.single("file"), createReport);

export default router;