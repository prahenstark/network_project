import React from "react";

const ToggleNav = ({ tabs, activeTab, setActiveTab, className = "" }) => {
  return (
    <nav
      className={`flex w-full justify-center text-white ${className}`}
    >
      {tabs.map((tab) => (
        <button
          key={tab}
          className={`py-2 w-1/4 ${
            activeTab === tab
              ? "bg-white bg-opacity-5 border-2 border-green-500"
              : "bg-white bg-opacity-5 hover:bg-opacity-10"
          } rounded-md transition`}
          onClick={() => setActiveTab(tab)}
        >
          {tab}
        </button>
      ))}
    </nav>
  );
};

export default ToggleNav;
