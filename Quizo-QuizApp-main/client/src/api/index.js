import { registerUser, loginUser, ResetPassword } from "./authApi.js";
import { fetchUserProfile } from "./userApi.jsx";
import { submitQuizScore, fetchMyScores } from "./scoreApi.js";
import { 
  getDashboardStats, 
  getAllStudents, 
  getQuizResults,
  downloadStudentData,
  downloadQuizResults 
} from "./adminApi.js";

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
  // Admin functions
  getDashboardStats,
  getAllStudents,
  getQuizResults,
  downloadStudentData,
  downloadQuizResults,
};
