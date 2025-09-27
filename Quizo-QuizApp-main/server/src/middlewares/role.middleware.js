import { User } from "../models/user.model.js";

/**
 * Middleware to check if user has required role(s)
 * @param {string|string[]} allowedRoles - Role(s) that are allowed to access the route
 * @returns {Function} Express middleware function
 */
export const requireRole = (allowedRoles) => {
  return async (req, res, next) => {
    console.log("🔒 Role middleware called with roles:", allowedRoles);
    try {
      // Ensure user is authenticated first (should be called after verifyToken)
      if (!req.user || !req.user.userId) {
        console.log("❌ No authenticated user found in request");
        return res.status(401).json({
          error: "Authentication required",
          message: "Please log in to access this resource"
        });
      }

      // Fetch user from database to get current role
      console.log("🔍 Looking up user:", req.user.userId);
      const user = await User.findById(req.user.userId).select('userType');
      if (!user) {
        console.log("❌ User not found in database:", req.user.userId);
        return res.status(404).json({
          error: "User not found",
          message: "User account not found"
        });
      }
      
      console.log("👤 User found with role:", user.userType);

      // Ensure allowedRoles is an array
      const rolesArray = Array.isArray(allowedRoles) ? allowedRoles : [allowedRoles];
      console.log("📝 Checking if role", user.userType, "is in allowed roles:", rolesArray);
      
      // Check if user's role is in the allowed roles
      if (!rolesArray.includes(user.userType)) {
        console.log("❌ Access denied - role mismatch");
        return res.status(403).json({
          error: "Access denied",
          message: `This action requires ${rolesArray.join(' or ')} role. Your role: ${user.userType}`
        });
      }

      // Add user role to request object for use in controllers
      req.userRole = user.userType;
      console.log("✅ Role authorization successful - proceeding to next middleware/controller");
      next();
    } catch (error) {
      console.error("Role authorization error:", error);
      return res.status(500).json({
        error: "Authorization error",
        message: "Error checking user permissions"
      });
    }
  };
};

/**
 * Middleware specifically for student-only routes
 */
export const requireStudent = requireRole('student');

/**
 * Middleware specifically for faculty-only routes
 */
export const requireFaculty = requireRole('faculty');

/**
 * Middleware that allows both students and faculty
 */
export const requireAuthenticated = requireRole(['student', 'faculty']);