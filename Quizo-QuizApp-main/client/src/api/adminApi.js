const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

// Helper function to get auth headers
const getAuthHeaders = () => {
  const token = localStorage.getItem("token") || sessionStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

// Helper function to handle API responses
const handleResponse = async (response) => {
  const data = await response.json();
  
  if (!response.ok) {
    throw new Error(data.message || data.error || "Something went wrong");
  }
  
  return data;
};

/**
 * Get dashboard statistics
 */
export const getDashboardStats = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/admin/dashboard/stats`, {
      method: "GET",
      headers: getAuthHeaders(),
    });

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    throw error.message || "Failed to fetch dashboard statistics";
  }
};

/**
 * Get all students with pagination
 */
export const getAllStudents = async (page = 1, limit = 10) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/students?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching students:", error);
    throw error.message || "Failed to fetch students data";
  }
};

/**
 * Get quiz results with pagination
 */
export const getQuizResults = async (page = 1, limit = 20) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/quiz-results?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    return await handleResponse(response);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    throw error.message || "Failed to fetch quiz results";
  }
};

/**
 * Download student data as CSV or TXT
 */
export const downloadStudentData = async (format = "csv") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/export/students?format=${format}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to download data");
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `students_data.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=\"(.+)\"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, message: "Download completed successfully" };
  } catch (error) {
    console.error("Error downloading student data:", error);
    throw error.message || "Failed to download student data";
  }
};

/**
 * Download quiz results as CSV or TXT
 */
export const downloadQuizResults = async (format = "csv") => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/admin/export/quiz-results?format=${format}`,
      {
        method: "GET",
        headers: getAuthHeaders(),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Failed to download data");
    }

    // Get the filename from the Content-Disposition header
    const contentDisposition = response.headers.get("content-disposition");
    let filename = `quiz_results.${format}`;
    if (contentDisposition) {
      const filenameMatch = contentDisposition.match(/filename=\"(.+)\"/);
      if (filenameMatch) {
        filename = filenameMatch[1];
      }
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);

    return { success: true, message: "Download completed successfully" };
  } catch (error) {
    console.error("Error downloading quiz results:", error);
    throw error.message || "Failed to download quiz results";
  }
};