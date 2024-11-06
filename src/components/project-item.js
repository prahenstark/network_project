// src/components/ListItem.js
"use-client";
import React, { useState } from "react";
import AddProjectModal from "./projects/add-project-modal";
import HandoverModal from "./projects/handover-modal";
import DeleteModal from "./projects/delete-modal";

const ProjectItem = ({ item }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isHandoverModalOpen, setHandoverModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);

  return (
    <>
      <li className="flex items-center justify-between p-3 rounded-md shadow-sm font-medium">
        {/* Left: Item name */}
        <span>{item}</span>

        {/* Right: Action Buttons */}
        <div className="flex space-x-2">
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

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      <HandoverModal
        isOpen={isHandoverModalOpen}
        onClose={() => setHandoverModalOpen(false)}
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
      />
    </>
  );
};

export default ProjectItem;
