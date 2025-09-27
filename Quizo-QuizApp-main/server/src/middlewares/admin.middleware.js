import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";
import conf from "../conf/conf.js";

const JWT_SECRET = conf.JWT_SECRET;

/**
 * Middleware to verify admin authentication and authorization
 */
export const verifyAdmin = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        error: "Authentication required"
      });
    }

    // Verify JWT token
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
        error: "Authentication failed"
      });
    }

    // Check if user is admin
    if (user.userType !== "admin") {
      return res.status(403).json({
        message: "Access denied. Admin privileges required.",
        error: "Authorization failed"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        error: "Authentication failed"
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired.",
        error: "Authentication failed"
      });
    }
    
    console.error("Admin middleware error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};

/**
 * Middleware to verify if user is admin or faculty (for some shared endpoints)
 */
export const verifyAdminOrFaculty = async (req, res, next) => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");
    
    if (!token) {
      return res.status(401).json({
        message: "Access denied. No token provided.",
        error: "Authentication required"
      });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.userId).select("-password");
    
    if (!user) {
      return res.status(401).json({
        message: "Invalid token. User not found.",
        error: "Authentication failed"
      });
    }

    // Check if user is admin or faculty
    if (user.userType !== "admin" && user.userType !== "faculty") {
      return res.status(403).json({
        message: "Access denied. Admin or faculty privileges required.",
        error: "Authorization failed"
      });
    }

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        message: "Invalid token.",
        error: "Authentication failed"
      });
    }
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        message: "Token expired.",
        error: "Authentication failed"
      });
    }
    
    console.error("Admin/Faculty middleware error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};