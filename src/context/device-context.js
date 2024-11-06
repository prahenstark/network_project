// context/ProjectContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const DeviceContext = createContext();

export const DeviceProvider = ({ children }) => {
  const [selectedProject, setSelectedProject] = useState(null);

  return (
    <DeviceContext.Provider value={{ selectedProject, setSelectedProject }}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDevice = () => {
  return useContext(DeviceContext);
};
