import { registerUser, loginUser, ResetPassword } from "./authApi.js";
import { fetchUserProfile } from "./userApi.jsx";
import { submitQuizScore, fetchMyScores } from "./scoreApi.js";

import {
  fetchQuizQuestions,
  getQuestions,
  addQuestion,
  deleteQuestion,
} from "./quizApi.jsx";


export {
  registerUser,
  loginUser,
  fetchUserProfile,
  ResetPassword,
  //
  fetchQuizQuestions,
  getQuestions,
  addQuestion,
  deleteQuestion,
  submitQuizScore,
  fetchMyScores,
};
