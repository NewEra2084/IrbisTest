// api.js
import axios from "axios";
import { useAuthStore } from "@/store/authStore";
import {authApi} from "@/js/api-auth";

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry && !authApi.isLoginUrl(originalRequest.url)) {
      originalRequest._retry = true;
      const store = useAuthStore.getState();

      store.openLoginModal();

      if (authApi.isMeUrl(originalRequest.url)){
          return Promise.reject(error);
      }

      return store.enqueueRequest(() => api(originalRequest));
    }

    return Promise.reject(error);
  }
);

export default api;
