const baseURL = "http://192.168.1.11:8080/api";

import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// axios instance
export const axiosInstance = axios.create({
  baseURL,
  headers: {
    "Content-Type": "application/json",
  },
});

// disable cors for development

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
