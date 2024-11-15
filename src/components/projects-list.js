"use client";
import { FolderUp, FolderIcon } from "lucide-react";
import { useDevice } from "@/context/device-context";
import { useEffect, useState } from "react";
import { CornerDownRight } from "lucide-react";

export default function ProjectList({ projects = [] }) {
  const [selectedProject, setSelected] = useState(null);
  const { setSelectedDeviceProject } = useDevice();

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
      setSelected(mainProject);
      setSelectedDeviceProject(mainProject);
    }
  }, [projects]);

  // Recursive function to render the project hierarchy
  const renderProjects = (projects) => {
    return (
      <ul className="flex flex-col gap-2">
        {projects.map((project) => (
          <li key={project.gid}>
            <div
              onClick={() => handleSelectProject(project)}
              className={`flex items-center gap-2 py-2 px-6 hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer ${
                isSelected(project) ? "bg-primary" : ""
              }`}
            >
              {/* <CornerDownRight size={16}/> */}
              <FolderIcon size={16} />
              <span className="text-sm text-white">{project.name}</span>
            </div>
            {/* If the project has children, render them recursively */}
            {project.child?.length > 0 && (
              <div className="ml-6 mt-2">{renderProjects(project.child)}</div>
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <div className="bg-[#21312A] min-w-60 max-h-[calc(100vh-5rem)] p-4 rounded-tr-3xl overflow-y-auto [&::-webkit-scrollbar]:w-2 [&::-webkit-scrollbar-track]:rounded-full [&::-webkit-scrollbar-track]:bg-white [&::-webkit-scrollbar-track]:bg-opacity-5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-gray-300 dark:[&::-webkit-scrollbar-track]:bg-neutral-700 dark:[&::-webkit-scrollbar-thumb]:bg-neutral-500">
      <h2 className="text-xl font-semibold mb-4">Project List</h2>
      {renderProjects(projects)}
    </div>
  );
}
