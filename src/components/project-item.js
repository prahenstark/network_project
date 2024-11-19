"use client";
import React, { useState } from "react";
import AddProjectModal from "./projects/add-project-modal";
import HandoverModal from "./projects/handover-modal";
import DeleteModal from "./projects/delete-modal";
import { ChevronRight } from "lucide-react";
import { useProject } from "@/context/project-provider";

const ProjectItem = ({ item, id, refreshAction, child = [] }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isHandoverModalOpen, setHandoverModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For dropdown state

  const toggleDropdown = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <li className="sm:flex flex-col sm:flex-row items-start sm:items-center justify-between py-3 px-1 md:pd-3 rounded-md shadow-sm border-b font-medium">
        {/* Main Project Row */}
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            child.length > 0 ? "hover:text-green-500" : ""
          }`}
          onClick={child.length > 0 ? toggleDropdown : undefined}
        >
          {child.length > 0 && (
            <ChevronRight
              size={16}
              className={`transition-transform ${
                isExpanded ? "rotate-90" : ""
              }`}
            />
          )}
          <span>{item}</span>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-4 max-sm:mt-2 justify-between items-start">
          <button
            onClick={() => setHandoverModalOpen(true)}
            className="md:px-4 md:py-2 px-2 py-1 text-xs md:text-sm font-medium text-white bg-blue-500 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 transition"
          >
            Handover
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="md:px-4 md:py-2 px-2 py-1 text-xs md:text-sm font-medium text-white bg-green-500 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition"
          >
            Add
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="md:px-4 md:py-2 px-2 py-1 text-xs md:text-sm font-medium text-white bg-red-500 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 transition"
          >
            Delete
          </button>
        </div>
      </li>

      {/* Dropdown for Child */}
      {isExpanded && child.length > 0 && (
        <ul className="ml-6 space-y-2">
          {child.map((child) => (
            <ProjectItem
              key={child.gid}
              item={child.name}
              id={child.gid}
              refreshAction={refreshAction}
              child={child.child}
            />
          ))}
        </ul>
      )}

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        name={item}
        refreshAction={refreshAction}
        id={id}
      />

      <HandoverModal
        isOpen={isHandoverModalOpen}
        refreshAction={refreshAction}
        onClose={() => setHandoverModalOpen(false)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        refreshAction={refreshAction}
        onClose={() => setDeleteModalOpen(false)}
        name={item}
        id={id}
      />
    </>
  );
};

export default ProjectItem;
