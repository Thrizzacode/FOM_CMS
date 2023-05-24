import axios from "axios";
import router from "../router";
import { ElMessage } from "element-plus";
const axiosConfig = axios.create({
  baseURL: "https://localhost:8080",
});

axiosConfig.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosConfig.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response.status === 401) {
      localStorage.removeItem("token");
      router.push("/login");
      ElMessage.error("Token失效，請重新登錄");
      return Promise.reject(error);
    } else if (error.response.status === 403) {
      ElMessage.error("權限不足，請聯繫管理員");
    }
  }
);

export default axiosConfig;
