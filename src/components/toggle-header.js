// src/components/Header.js
import React from "react";

const ToggleHeader = ({ pageName, children, className }) => {
  return (
    <div
      className={`flex items-center justify-between rounded-md shadow-sm max-h-16 w-full ${className}`}
    >
      {/* Left: Page Name */}
      <h2 className="text-lg font-semibold ">{pageName}</h2>

      {/* Right: Placeholder for Control Buttons */}
      <div className="">
        <div className="flex flex-grow mx-auto w-full space-x-4 h-9">
          {children}
        </div>
      </div>
    </div>
  );
};

export default ToggleHeader;
