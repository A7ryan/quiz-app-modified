import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireFaculty, requireStudent, requireAuthenticated } from "../middlewares/role.middleware.js";
import { quizQuestions, getAllQuestions, addQuestion, deleteQuestion  } from "../controllers/quiz.controller.js";

const router = express.Router();

// Routes for taking quizzes - only students can access
router.get("/questions", verifyToken, requireStudent, quizQuestions);
router.get("/", verifyToken, requireAuthenticated, getAllQuestions); // Both can view all questions

// Routes for creating/managing quizzes - only faculty can access
router.post("/", verifyToken, requireFaculty, addQuestion);
router.delete("/:id", verifyToken, requireFaculty, deleteQuestion);

export default router;
