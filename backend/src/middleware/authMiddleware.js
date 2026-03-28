import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protect = async (req, res, next) => {
  let token;

  if (req.headers.authorization?.startsWith("Bearer")) {
    token = req.headers.authorization.split(" ")[1];

    if (!token || token === "undefined" || token === "null") {
      console.error("❌ Auth Error: Token is missing or invalid string:", token);
      return res.status(401).json({ message: "Not authorized, invalid token" });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ Token Decoded:", decoded);

      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        console.error("❌ Auth Error: User with ID", decoded.id, "not found");
        return res.status(401).json({ message: "Not authorized, user not found" });
      }

      req.user = user;

      next();
    } catch (error) {
      console.error("❌ Auth Error:", error.message);
      res.status(401).json({ message: "Not authorized" });
    }
  } else {
    res.status(401).json({ message: "No token" });
  }
};