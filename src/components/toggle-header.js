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
      <div>
        <div className="space-x-4">{children}</div>
      </div>
    </div>
  );
};

export default ToggleHeader;
