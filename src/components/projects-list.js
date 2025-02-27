"use client";
import { FolderIcon } from "lucide-react";
import { useDevice } from "@/context/device-context";
import { useEffect, useState } from "react";
import { ChevronDown } from "lucide-react";
import { ChevronUp } from "lucide-react";
import { CornerDownRight } from "lucide-react";

export default function ProjectList({ projects = [] }) {
  const [selectedProject, setSelected] = useState(null);
  const { setSelectedDeviceProject } = useDevice();
  const [showDropdown, setShowDropdown] = useState(false);

  // Handle project selection
  const handleSelectProject = (project) => {
    setSelected(project);
    setSelectedDeviceProject(project);
  };

  // Check if a project is selected
  const isSelected = (project) => {
    return selectedProject?.gid === project?.gid;
  };

  useEffect(() => {
    if (projects.length > 0) {
      const [mainProject] = projects;
      setSelected(mainProject?.child[0]);
      setSelectedDeviceProject(mainProject?.child[0]);
    }
  }, [projects]);

  // Recursive function to render the project hierarchy
  const renderProjects = (projects, isRoot = false) => {
    return (
      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.gid}>
            <div
              onClick={!isRoot ? () => handleSelectProject(project) : undefined}
              className={`flex items-center gap-2 py-2 px-6 hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer ${
                isSelected(project) ? "bg-primary" : ""
              } ${
                isRoot ? "cursor-default hover:bg-transparent font-bold" : ""
              }`}
            >
              <CornerDownRight size={16} />
              <FolderIcon size={16} />
              <span className="text-sm text-white">{project.name}</span>
            </div>
            {/* If the project has children, render them recursively */}
            {project.child?.length > 0 && (
              <div className="ml-6 mt-2">
                {renderProjects(project.child, false)}
              </div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-[#21312A] min-w-60 md:min-h-svh p-4 rounded-tr-3xl max-md:rounded-3xl max-md:mx-6 overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <div
        className={`flex items-center justify-between md:pb-6 ${
          showDropdown && "max-md:pb-6"
        }`}
      >
        <h2 className="text-xl font-semibold">Project List</h2>
        <button
          className="md:hidden"
          onClick={() => {
            setShowDropdown(!showDropdown);
          }}
        >
          {showDropdown ? <ChevronUp /> : <ChevronDown />}
        </button>
      </div>
      <div className={showDropdown ? "" : "max-md:hidden"}>
        {renderProjects(projects, true)} {/* Pass true for root projects */}
      </div>
    </div>
  );
}
