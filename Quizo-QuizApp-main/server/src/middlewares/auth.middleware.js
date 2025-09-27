import jwt from "jsonwebtoken";
import conf from "../conf/conf.js";

import dotenv from "dotenv";
dotenv.config();

const JWT_SECRET = conf.JWT_SECRET;

export async function verifyToken(req, res, next) {
  console.log("🔐 Auth middleware called for:", req.method, req.path);

  const authHeader = req.header("Authorization");
  console.log("📝 Auth header:", authHeader ? "Present" : "Missing");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    console.log("❌ No valid auth header");
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  const token = authHeader.split(" ")[1];
  console.log("🎫 Token extracted:", token ? "Yes" : "No");

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("✅ Token decoded successfully:", { userId: decoded.userId, userType: decoded.userType });

    req.user = decoded; // Attach decoded user info to request
    next();
  } catch (err) {
    console.log("❌ Token verification failed:", err.message);
    return res.status(403).json({ error: "Invalid or expired token" });
  }
}
