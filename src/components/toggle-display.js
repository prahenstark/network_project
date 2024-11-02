import React from "react";
import ToggleHeader from "./toggle-header";

const ToggleDisplay = ({ activeTab, content }) => {
  // Content for each tab
  console.log(content[activeTab]);

  return (
    <>
      <ToggleHeader pageName={activeTab} />
      <div className="p-6 bg-white shadow-md rounded-lg mt-4 text-gray-800">
        <h2 className="text-2xl font-bold mb-2">{activeTab}</h2>
        <p className=" text-lg font-bold mb-2 p-5 text-black">
          {content[activeTab]}
        </p>
      </div>
    </>
  );
};

export default ToggleDisplay;
