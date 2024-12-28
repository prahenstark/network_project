// context/ProjectContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const LogDeviceContext = createContext();

export const LogDeviceProvider = ({ children }) => {
  const [selectedLogDevice, setSelectedLogDevice] = useState(null);

  return (
    <LogDeviceContext.Provider
      value={{ selectedLogDevice, setSelectedLogDevice }}
    >
      {children}
    </LogDeviceContext.Provider>
  );
};

export const useLogDevice = () => {
  return useContext(LogDeviceContext);
};
