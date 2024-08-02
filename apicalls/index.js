// const baseURL = "http://172.20.10.4:8082/api";
const baseURL = "https://expense-tracker-api-3puk.onrender.com/api";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add a request interceptor to include the token
axiosInstance.interceptors.request.use(
  async (config) => {
    const token = await AsyncStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);
