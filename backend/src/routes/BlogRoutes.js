import express from "express";
import {
  createBlog,
  getApprovedBlogs,
  getPendingBlogs,
  updateBlogStatus,
} from "../controllers/blogController.js";
import { protect } from "../middleware/authMiddleware.js";
import { adminOnly } from "../middleware/adminMiddleware.js";
import { upload } from "../middleware/uploadMiddleware.js";

const router = express.Router();

router.post("/", protect, upload.single("image"), createBlog);
router.get("/approved", getApprovedBlogs);
router.get("/pending", protect, adminOnly, getPendingBlogs);
router.put("/status/:id", protect, adminOnly, updateBlogStatus);

export default router;
