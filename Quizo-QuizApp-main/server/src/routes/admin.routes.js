import express from "express";
import {
  getDashboardStats,
  getAllStudents,
  getQuizResults,
  exportStudentData,
  exportQuizResults
} from "../controllers/admin.controller.js";
import { verifyAdmin } from "../middlewares/admin.middleware.js";

const router = express.Router();

// Apply admin middleware to all routes
router.use(verifyAdmin);

/**
 * @route   GET /api/admin/dashboard/stats
 * @desc    Get dashboard statistics
 * @access  Admin only
 */
router.get("/dashboard/stats", getDashboardStats);

/**
 * @route   GET /api/admin/students
 * @desc    Get all students with performance data
 * @access  Admin only
 * @query   page, limit (for pagination)
 */
router.get("/students", getAllStudents);

/**
 * @route   GET /api/admin/quiz-results
 * @desc    Get all quiz results
 * @access  Admin only
 * @query   page, limit (for pagination)
 */
router.get("/quiz-results", getQuizResults);

/**
 * @route   GET /api/admin/export/students
 * @desc    Export student data as CSV or TXT
 * @access  Admin only
 * @query   format (csv/txt)
 */
router.get("/export/students", exportStudentData);

/**
 * @route   GET /api/admin/export/quiz-results
 * @desc    Export quiz results as CSV or TXT
 * @access  Admin only
 * @query   format (csv/txt)
 */
router.get("/export/quiz-results", exportQuizResults);

export default router;