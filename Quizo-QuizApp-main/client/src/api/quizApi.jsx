import conf from "../conf/conf.js";
import axios from "axios";

// Set up base URL for the API
const API_BASE_URL = `${conf.server_url}/api/quiz`;

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
};

// Fetch all quiz questions
export const fetchQuizQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/questions`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching quiz questions:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch quiz questions"
    );
  }
};

// Get all questions- created
export const getQuestions = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}`, {
      headers: getAuthHeaders()
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching questions:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to fetch questions"
    );
  }
};

// Add a new question
export const addQuestion = async (questionData) => {
  console.log({ questionData });

  try {
    const response = await axios.post(`${API_BASE_URL}`, questionData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json'
      }
    });
    console.log({ response });

    return response.data;
  } catch (error) {
    console.error("Error adding question:", error.message);
    throw new Error(error.response?.data?.message || "Failed to add question");
  }
};

// Delete a question by ID
export const deleteQuestion = async (id) => {
  try {
    await axios.delete(`${API_BASE_URL}/${id}`, {
      headers: getAuthHeaders()
    });
    return { success: true, message: "Question deleted successfully" };
  } catch (error) {
    console.error("Error deleting question:", error.message);
    throw new Error(
      error.response?.data?.message || "Failed to delete question"
    );
  }
};
