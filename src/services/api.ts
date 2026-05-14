import axios from "axios";

// Default to API Gateway base port 8000
const API_BASE_URL = "http://localhost:8000/api";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Response Interceptor for centralized error management
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    console.error("API Gateway Communication Error:", error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const AstrologyService = {
  generateKundali: async (params: { native_name: str; dob: str; tob: str; location: str }) => {
    const response = await apiClient.get("/kundali/generate", { params });
    return response.data;
  },
  getTodayPanchang: async (params: { date: str; lat?: number; lon?: number }) => {
    const response = await apiClient.get("/panchang/today", { params });
    return response.data;
  },
  getMatchmakingScore: async (params: {
    boy_name: str;
    boy_dob: str;
    boy_tob: str;
    girl_name: str;
    girl_dob: str;
    girl_tob: str;
  }) => {
    const response = await apiClient.get("/matchmaking/score", { params });
    return response.data;
  },
  findMuhurat: async (params: { event_type: str; start_date: str; end_date: str }) => {
    const response = await apiClient.get("/muhurat/finder", { params });
    return response.data;
  },
};
