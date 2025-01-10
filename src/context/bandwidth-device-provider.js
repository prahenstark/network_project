// context/ProjectContext.js
"use client";
import React, { createContext, useContext, useState } from "react";

const BandwidthDeviceContext = createContext();

export const BandwidthDeviceProvider = ({ children }) => {
  const [selectedBandwidthDevice, setSelectedBandwidthDevice] = useState(null);

  return (
    <BandwidthDeviceContext.Provider
      value={{ selectedBandwidthDevice, setSelectedBandwidthDevice }}
    >
      {children}
    </BandwidthDeviceContext.Provider>
  );
};

export const useBandwidthDevice = () => {
  return useContext(BandwidthDeviceContext);
};
