import axios from "axios";
import ENDPOINTS from "./endpoints";

export const api = axios.create({
  baseURL: ENDPOINTS.BASE_URL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
    apikey: "pixel",
  },
});


api.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => Promise.reject(error)
);


api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {

    
    const status = error?.response?.status;
    let message = "Unable to connect to the server. Please check your internet connection.";

    if (status === 401 || status === 403) {
      message = "Invalid API Key. Access denied.";
    } else if (status === 404) {
      message = "Endpoint not found.";
    } else if (status >= 500) {
      message = "Server error. Please try again later.";
    }

    return Promise.reject({
      status,
      message,
      originalError: error,
    });
  }
);

export default api;
