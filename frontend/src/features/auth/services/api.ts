import axios from "axios";

const API_BASE_URL = "http://localhost:8000";

const studentApi = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor: Attach access token to headers
studentApi.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem("bit_student_access_token") || sessionStorage.getItem("bit_student_access_token");
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor: Detect 401, initiate refresh token flow, and retry
studentApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    // Check if response is 401, has not been retried yet, and isn't the login/refresh request
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/api/auth/login") &&
      !originalRequest.url.includes("/api/auth/refresh")
    ) {
      originalRequest._retry = true;
      const refreshToken = localStorage.getItem("bit_student_refresh_token") || sessionStorage.getItem("bit_student_refresh_token");
      
      if (!refreshToken) {
        // No refresh token available, force clean logout
        clearStudentSession();
        return Promise.reject(error);
      }
      
      try {
        // Attempt token refresh via endpoint
        const response = await axios.post(`${API_BASE_URL}/api/auth/refresh`, {
          refresh_token: refreshToken,
        });
        
        const { access_token, refresh_token } = response.data;
        
        // Store the rotated token values in whichever storage they were found in
        const isLocalStorage = localStorage.getItem("bit_student_refresh_token") !== null;
        const storage = isLocalStorage ? localStorage : sessionStorage;
        storage.setItem("bit_student_access_token", access_token);
        storage.setItem("bit_student_refresh_token", refresh_token);
        
        // Update original request headers and retry it
        originalRequest.headers.Authorization = `Bearer ${access_token}`;
        return studentApi(originalRequest);
      } catch (refreshError) {
        // If refresh fails, clear session data and reject
        clearStudentSession();
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export function clearStudentSession() {
  localStorage.removeItem("bit_student_access_token");
  localStorage.removeItem("bit_student_refresh_token");
  sessionStorage.removeItem("bit_student_access_token");
  sessionStorage.removeItem("bit_student_refresh_token");
  // Dispatch custom event to notify components/Context of session clearance
  window.dispatchEvent(new Event("student-logout"));
}


export default studentApi;
