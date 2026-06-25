import axios from "axios";
import { showLoading, hideLoading } from "../utils/loadingBridge";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// REQUEST → thêm token + bật loading
api.interceptors.request.use((config) => {
  showLoading(); //bật loading

  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// RESPONSE → xử lý
api.interceptors.response.use(
  (res) => {
    hideLoading(); // tắt loading khi success
    return res;
  },
  (error) => {
    hideLoading(); //tắt loading khi error

    const status = error.response?.status;

    const message =
      error.response?.data?.message ||
      error.response?.data?.error ||
      (typeof error.response?.data === "string" ? error.response.data : null) ||
      "Something went wrong";

    const currentPath = window.location.pathname;

    //BỊ BAN
    if (status === 403) {
      localStorage.removeItem("token");
      localStorage.setItem("reason", "banned");

      if (currentPath !== "/login") {
        window.location.replace("/login");
      }
    }

    //TOKEN HẾT HẠN
    if (status === 401) {
      localStorage.removeItem("token");
      localStorage.setItem("reason", "expired");

      if (currentPath !== "/login") {
        window.location.replace("/login");
      }
    }

    console.error("API ERROR:", message);

    return Promise.reject({
      ...error,
      customMessage: message,
    });
  },
);

export default api;
