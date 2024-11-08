"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

// Axios instance for API calls
const apiInstance = axios.create({
  baseURL: "http://13.233.36.198:5000/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the token dynamically and handle 401 errors
apiInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("bearerToken");
    // console.log(token)
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const router = useRouter();
      router.push("/auth/login"); // Redirect to /auth/login on 401
    }
    return Promise.reject(error);
  }
);

export const fetchDashboardInfo = async (path, method = "GET", data = null) => {
  try {
    const response = await apiInstance({
      url: "cloudnet/portal/dashboard" + path,
      method: method,
      data: data,
    });
    return response.data;
  } catch (error) {
    console.log(
      `Error ${method === "POST" ? "posting" : "fetching"} dashboard data:`,
      error
    );
    // Additional error handling if needed
  }
};
