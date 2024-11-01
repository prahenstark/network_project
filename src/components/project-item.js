// src/components/ListItem.js
import React from "react";

const ProjectItem = ({ item }) => {
  return (
    <li className="flex items-center justify-between p-3 rounded-md shadow-sm  font-medium">
      {/* Left: Item name */}
      <span>{item}</span>

      {/* Right: Action Buttons */}
      <div className="flex space-x-2">
        <button className="px-3 py-1 font-medium text-blue-500 rounded-sm hover:text-blue-600 transition">
          Handover
        </button>
        <button className="px-3 py-1 font-medium text-green-500 rounded-sm hover:text-green-600 transition">
          Add
        </button>
        <button className="px-3 py-1 font-medium text-red-500 rounded-sm hover:text-red-600 transition">
          Delete
        </button>
      </div>
    </li>
  );
};

export default ProjectItem;
