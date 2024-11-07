// context/ProjectContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [selectedDeviceProject, setSelectedDeviceProject] = useState(null);

  return (
    <DeviceContext.Provider
      value={{ selectedDeviceProject, setSelectedDeviceProject }}
    >
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  return useContext(DeviceContext);
};
