// src/components/ListItem.js
import React from "react";

const ProjectList = ({ item }) => {
  return (
    <li className="flex items-center justify-between p-3 rounded-md shadow-sm  font-medium">
      {/* Left: Item name */}
      <span>{item}</span>

      {/* Right: Action Buttons */}
      <div className="flex space-x-2">
        <button className="px-3 py-1 bg-blue-500 bg-opacity-20 text-white rounded-sm hover:bg-blue-600 transition">
          Handover
        </button>
        <button className="px-3 py-1 bg-green-500 bg-opacity-20 text-white rounded-sm hover:bg-green-600 transition">
          Add
        </button>
        <button className="px-3 py-1 bg-red-500 bg-opacity-20 text-white rounded-sm hover:bg-red-600 transition">
          Delete
        </button>
      </div>
    </li>
  );
};

export default ProjectList;
