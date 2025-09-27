import conf from "../conf/conf.js";
import axios from "axios";

const API_BASE_URL = `${conf.server_url}/api/user`;

// Fetch profile
export const fetchUserProfile = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE_URL}/profile`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Update profile
export const updateUserProfile = async (profileData) => {
  const token = localStorage.getItem("token");
  const response = await axios.put(`${API_BASE_URL}/profile`, profileData, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};
