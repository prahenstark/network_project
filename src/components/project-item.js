// src/components/ListItem.js
"use-client";
import React, { useState } from "react";
import AddProjectModal from "./projects/add-project-modal";
import HandoverModal from "./projects/handover-modal";
import DeleteModal from "./projects/delete-modal";
import { useProject } from "@/context/project-provider";

const ProjectItem = ({ item, id, refreshAction }) => {
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isHandoverModalOpen, setHandoverModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const { setSelectedProject } = useProject();
  const [selectedProject, setSelected] = useState(null);

  return (
    <>
      <li className="sm:flex items-center justify-between p-3 rounded-md shadow-sm border-b font-medium">
        {/* Left: Item name */}
        <div>{item}</div>

        {/* Right: Action Buttons */}
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
