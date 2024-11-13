// src/components/Header.js
import React from "react";

const ToggleHeader = ({ pageName, children, className }) => {
  return (
    <div
      className={`flex max-lg:flex-wrap items-center justify-between rounded-md shadow-sm max-h-16 w-full ${className}`}
    >
      {/* Left: Page Name */}
      <h2 className="text-lg font-semibold ">{pageName}</h2>

      {/* Right: Placeholder for Control Buttons */}
      <div className="flex max-lg:mt-4 flex-wrap gap-4">{children}</div>
    </div>
  );
};

export default ToggleHeader;
