"use client";
import React, { useState } from "react";
import AddProjectModal from "./projects/add-project-modal";
import HandoverModal from "./projects/handover-modal";
import DeleteModal from "./projects/delete-modal";
import { ChevronRight } from "lucide-react";
import { useProject } from "@/context/project-provider";

const ProjectItem = ({ item, id, refreshAction, children = [] }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isHandoverModalOpen, setHandoverModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // For dropdown state

  const toggleDropdown = () => setIsExpanded((prev) => !prev);

  return (
    <>
      <li className="sm:flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md shadow-sm border-b font-medium">
        {/* Main Project Row */}
        <div
          className={`flex items-center gap-2 cursor-pointer ${
            children.length > 0 ? "hover:text-green-500" : ""
          }`}
          onClick={children.length > 0 ? toggleDropdown : undefined}
        >
          {children.length > 0 && (
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
        <div className="flex space-x-2 max-sm:mt-2">
          <button
            onClick={() => setHandoverModalOpen(true)}
            className="px-3 py-1 font-medium text-blue-500 rounded-sm hover:text-blue-600 transition"
          >
            Handover
          </button>
          <button
            onClick={() => setAddModalOpen(true)}
            className="px-3 py-1 font-medium text-green-500 rounded-sm hover:text-green-600 transition"
          >
            Add
          </button>
          <button
            onClick={() => setDeleteModalOpen(true)}
            className="px-3 py-1 font-medium text-red-500 rounded-sm hover:text-red-600 transition"
          >
            Delete
          </button>
        </div>
      </li>

      {/* Dropdown for Children */}
      {isExpanded && children.length > 0 && (
        <ul className="ml-6 space-y-2">
          {children.map((child) => (
            <ProjectItem
              key={child.gid}
              item={child.name}
              id={child.gid}
              refreshAction={refreshAction}
              children={child.child}
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
