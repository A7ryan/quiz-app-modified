import conf from "../conf/conf.js";
import axios from "axios";

const API_BASE_URL = `${conf.server_url}/api/score`;

// Submit quiz attempt
export const submitQuizScore = async (quizType, quizId, answers) => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.post(
      `${API_BASE_URL}/submit`,
      { quizType, quizId, answers },   // ✅ include quizId
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting quiz score:", error.message);
    throw error.response?.data?.message || "Failed to submit quiz score";
  }
};

// Fetch logged-in user’s past scores
export const fetchMyScores = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await axios.get(`${API_BASE_URL}/my-scores`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching scores:", error.message);
    throw error.response?.data?.message || "Failed to fetch scores";
  }
};
