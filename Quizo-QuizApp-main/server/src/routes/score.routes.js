import express from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { requireStudent, requireAuthenticated } from "../middlewares/role.middleware.js";
import { Score } from "../models/score.model.js";

const router = express.Router();

// Submit quiz (1 quiz, multiple questions) - only students can submit
router.post("/submit", verifyToken, requireStudent, async (req, res) => {
  try {
    const { answers } = req.body;

    if (!answers || !Array.isArray(answers) || answers.length === 0) {
      return res.status(400).json({ message: "Answers are required" });
    }

    const totalQuestions = answers.length;
    const correctAnswers = answers.filter((a) => a.isCorrect).length;
    const wrongAnswers = totalQuestions - correctAnswers;

    // ✅ Always create new attempt (no overwrite/accumulation)
    const score = await Score.create({
      user: req.user.userId,
      totalQuestions,
      correctAnswers,
      wrongAnswers,
      answers,
    });

    res.status(201).json(score);
  } catch (error) {
    console.error("Error submitting quiz:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

// Get all past attempts for logged-in user - both students and faculty can view scores
router.get("/my-scores", verifyToken, requireAuthenticated, async (req, res) => {
  try {
    const scores = await Score.find({ user: req.user.userId })
      .sort({ createdAt: -1 });
    res.json(scores);
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
