import { Score } from "../models/score.model.js";
import Quiz from "../models/quiz.model.js";
import FixedQuestions from "../models/fixedQuestions.model.js";

// Submit quiz answers and save score
// Submit quiz answers and save/update score
export const submitQuiz = async (req, res) => {
    try {
      const userId = req.user.userId;
      const { quizId, quizType, answers } = req.body;
  
      if (!quizId || !quizType || !["quiz", "fixed"].includes(quizType)) {
        return res.status(400).json({ message: "Invalid quiz submission" });
      }
  
      const totalQuestions = answers.length;
      const correctAnswers = answers.filter((a) => a.isCorrect).length;
      const wrongAnswers = totalQuestions - correctAnswers;
  
      const scoreDoc = await Score.findOneAndUpdate(
        { user: userId, quizId }, // 🟢 match by user + quiz
        {
          $set: {
            quizType,
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            answers,
            updatedAt: new Date(),
          },
        },
        { new: true, upsert: true }
      );
  
      res.status(200).json({
        message: "Quiz submitted successfully",
        score: scoreDoc,
      });
    } catch (error) {
      console.error("Error submitting quiz:", error);
      res.status(500).json({ message: "Error submitting quiz", error });
    }
  };
    
// Fetch user scores
export const getUserScores = async (req, res) => {
    try {
        const userId = req.user.userId;

        const scores = await Score.find({ user: userId }).sort({
        createdAt: -1,
        });

        res.status(200).json(scores);

    } catch (error) {
        console.error("Error fetching user scores:", error);
        res.status(500).json({ message: "Error fetching scores", error });
    }
};
