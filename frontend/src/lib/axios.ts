import axios, { AxiosError, type AxiosResponse } from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = api.defaults.headers.common.Authorization;
    if (token) {
        config.headers.Authorization = token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      delete api.defaults.headers.common.Authorization;
      localStorage.removeItem("authData");
    }

    return Promise.reject(error);
  }
);

export default api;