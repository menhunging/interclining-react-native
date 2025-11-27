import AsyncStorage from "@react-native-async-storage/async-storage";
import type { AxiosInstance, InternalAxiosRequestConfig } from "axios";
import axios from "axios";

const api: AxiosInstance = axios.create({
  baseURL: "https://api-clining.fourodev.ru/api/",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
  const token = await AsyncStorage.getItem("tokenCLEANING");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
