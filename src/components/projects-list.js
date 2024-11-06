// components/ProjectList.js
import { FolderUp } from "lucide-react";
import { FolderIcon } from "lucide-react";


export default function ProjectList({ projects = [] }) {
  const [mainProject, ...subProjects] = projects;
  return (
    <div className="bg-[#21312A] w-60 p-4 rounded-tr-3xl">
      <h2 className="text-xl font-semibold mb-4">Project List</h2>
      {/* <h2 className="text-lg underline underline-offset-4 font-semibold mb-4">
        Parent Project
      </h2> */}

      <ul className="flex flex-col gap-2">
        <li className="flex items-center gap-2 py-3  hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer hover:bg-primary">
          <FolderUp size={16} />
          <span className="text-base font-bold text-white">
            {mainProject.name}
          </span>
        </li>

        {subProjects.map((project) => (
          <li
            key={project.gid}
            onClick={() => setSelectedProject()}
            className="flex items-center gap-2 py-2 px-5 hover:bg-[#2C3E38] hover:border-2 border-2 border-transparent rounded-md cursor-pointer hover:bg-primary"
          >
            <FolderIcon size={16} />
            <span className="text-sm text-white">{project.name}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
