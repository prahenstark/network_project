"use client"

import React, { createContext, useContext, useState } from 'react';

// Create the context
const UIStateContext = createContext();

// Create a provider component
export const UIStateProvider = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <UIStateContext.Provider value={{ sidebarOpen, setSidebarOpen }}>
      {children}
    </UIStateContext.Provider>
  );
};

// Custom hook to use the UIStateContext
export const useUIState = () => {
  const context = useContext(UIStateContext);
  if (!context) {
    throw new Error('useUIState must be used within a UIStateProvider');
  }
  return context;
};
