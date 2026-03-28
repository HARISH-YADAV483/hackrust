import express from "express";
import {
  getUserProfile,
  updateProfilePic,
} from "../controllers/userController.js";

import { protect } from "../middleware/authMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.get("/profile", protect, getUserProfile);
router.put("/profile/pic", protect, upload.single("image"), updateProfilePic);

export default router;