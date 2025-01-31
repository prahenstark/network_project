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
    /*     console.log(
      `Error ${method === "POST" ? "posting" : "fetching"} dashboard data:`,
      error
    ); */
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
    /*     console.log(
      `Error ${method === "POST" ? "posting" : "fetching"} dashboard data:`,
      error
    ); */
  }
};

export const setupWebSocket = (url, options = {}) => {
  const {
    onOpen,
    onMessage,
    onError,
    onClose,
    reconnectAttempts = 5,
    reconnectDelay = 3000,
  } = options;

  let ws = null;
  let reconnectCount = 0;
  let reconnectTimeout;

  const connect = () => {
    ws = new WebSocket(url);

    ws.onopen = (event) => {
      console.log("WebSocket Connected");
      reconnectCount = 0; // Reset reconnect counter on successful connection
      if (onOpen) onOpen(event);
    };

    ws.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (onMessage) onMessage(data);
      } catch (error) {
        console.error("Error parsing WebSocket message:", error);
        if (onMessage) onMessage(event.data);
      }
    };

    ws.onerror = (error) => {
      console.error("WebSocket Error:", error);
      if (onError) onError(error);
    };

    ws.onclose = (event) => {
      console.log("WebSocket Disconnected");
      if (onClose) onClose(event);

      // Attempt to reconnect
      if (reconnectCount < reconnectAttempts) {
        reconnectCount++;
        console.log(
          `Attempting to reconnect (${reconnectCount}/${reconnectAttempts})...`
        );
        reconnectTimeout = setTimeout(connect, reconnectDelay);
      }
    };
  };

  const disconnect = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
    }
    if (ws) {
      ws.close();
    }
  };

  const sendMessage = (data) => {
    if (ws && ws.readyState === WebSocket.OPEN) {
      ws.send(typeof data === "string" ? data : JSON.stringify(data));
    } else {
      console.error("WebSocket is not connected");
    }
  };

  // Initial connection
  connect();

  // Return methods for external control
  return {
    disconnect,
    sendMessage,
    getStatus: () => ws?.readyState,
  };
};

// Example usage:
/*
const ws = setupWebSocket('ws://your-websocket-server', {
  onOpen: () => {
    console.log('Connected to WebSocket');
  },
  onMessage: (data) => {
    console.log('Received:', data);
  },
  onError: (error) => {
    console.error('WebSocket error:', error);
  },
  onClose: () => {
    console.log('WebSocket closed');
  },
  reconnectAttempts: 5,
  reconnectDelay: 3000,
});

// Send a message
ws.sendMessage({ type: 'hello', content: 'world' });

// Disconnect when done
ws.disconnect();
*/
