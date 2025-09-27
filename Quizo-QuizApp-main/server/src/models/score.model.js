import mongoose, { Schema } from "mongoose";

const answerSchema = new Schema({
  questionId: { type: Schema.Types.ObjectId, ref: "Quiz", required: true },
  selectedAnswer: { type: String, required: true },
  isCorrect: { type: Boolean, required: true },
});

const scoreSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    totalQuestions: { type: Number, required: true },
    correctAnswers: { type: Number, required: true },
    wrongAnswers: { type: Number, required: true },
    answers: [answerSchema],
  },
  { timestamps: true }
);

export const Score = mongoose.model("Score", scoreSchema);
