// components/ProjectList.js
"use client";
import { FolderUp } from "lucide-react";
import { FolderIcon } from "lucide-react";
import { useDevice } from "@/context/device-context";
import { useState } from "react";

export default function ProjectList({ projects = [] }) {
  const [mainProject, ...subProjects] = projects;
  const { setSelectedProject } = useDevice(); // Get the setSelectedProject function from context
  const [selectedProject, setSelected] = useState(null);

  const handleSelectProject = (project) => {
    setSelected(project);
    setSelectedProject(project);
    // console.log("Selected Project:", project);
  };

  const isSelected = (project) => {
    return selectedProject?.gid === project?.gid;
  };

  return (
    <div className="bg-[#21312A] min-w-60 h-[87.5vh] p-4 rounded-tr-3xl">
      <h2 className="text-xl font-semibold mb-4">Project List</h2>
      {/* <h2 className="text-lg underline underline-offset-4 font-semibold mb-4">
        Parent Project
      </h2> */}

      <ul className="flex flex-col gap-2">
        <li
          className={`flex items-center gap-2 py-3  hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer ${
            isSelected(mainProject) ? "bg-primary " : ""
          }`}
          onClick={() => handleSelectProject(mainProject)}
        >
          <FolderUp size={16} />
          <span className="text-base font-bold text-white">
            {mainProject?.name}
          </span>
        </li>

        {subProjects.map((project) => (
          <li
            key={project.gid}
            onClick={() => handleSelectProject(project)}
            className={`flex items-center gap-2 py-3 px-6 hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer ${
              isSelected(project) ? "bg-primary " : ""
            }`}
          >
            <FolderIcon size={16} />
            <span className="text-sm text-white">{project.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
