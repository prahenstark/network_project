"use client";

import axios from "axios";
import { useRouter } from "next/navigation";

export const API_URL = `http://65.1.1.229:5000/api`;

// Axios instance for API calls
const apiInstance = axios.create({
  baseURL: "http://65.1.1.229:5000/api",
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

export const fetchDashboardInfo = async (
  path,
  method = "GET",
  data = null,
  createFinalPath = true
) => {
  try {
    // If createFinalPath is true, append the base path, otherwise use the provided path as is
    const finalPath = createFinalPath
      ? path.startsWith("/cloudnet/portal/dashboard")
        ? path
        : "/cloudnet/portal/dashboard" + path
      : path;

    const response = await apiInstance({
      url: finalPath,
      method: method,
      data: data,
    });

    return response.data;
  } catch (error) {
    console.log(
      `Error ${method === "POST" ? "posting" : "fetching"} dashboard data:`,
      error
    );
  }
};

export const fetchProtectedInfo = async (path, method = "GET", data = null) => {
  try {
    // If createFinalPath is true, append the base path, otherwise use the provided path as is
    const finalPath = path;

    const response = await apiInstance({
      url: finalPath,
      method: method,
      data: data,
    });

    return response.data;
  } catch (error) {
    console.log(
      `Error ${method === "POST" ? "posting" : "fetching"} dashboard data:`,
      error
    );
  }
};
