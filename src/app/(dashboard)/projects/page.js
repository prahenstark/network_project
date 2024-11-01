// src/pages/MyPage.js
import React from "react";
import Navbar from "@/components/navbar";
import ProjectItem from "@/components/project-item";
import { Plus } from "lucide-react";
import Link from "next/link";

const Projects = () => {
  // Sample array to map over
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

  return (
    <>
      <Navbar title="Projects" />

      {/* Page Info */}
      <div className="p-4 mx-6 space-y-6 ">
        {/* Top Horizontal Section */}
        <div className="flex items-center justify-between p-4 text-white rounded-lg">
          {/* Left: Static Page Name */}
          <h2 className="text-lg font-semibold">Project</h2>

          {/* Right: Button */}
          <Link className="my-2" href={""}>
            <div className="icon p-2 border w-full bg-green-500 hover:bg-white hover:text-black border-transparent hover:border-border rounded-sm transition">
              <Plus size={20} />
            </div>
          </Link>
        </div>

        {/* Section with List */}
        <div className="p-4 shadow-md rounded-lg bg-white bg-opacity-5">
          <h3 className=" font-semibold mb-3">Project List</h3>
          <ul className="space-y-2">
            {items.map((item, index) => (
              <ProjectItem key={index} item={item} />
            ))}
          </ul>
        </div>

        {/* Another Rounded Corner Section */}
        <div className="p-4 bg-white bg-opacity-5 shadow-md rounded-lg">
          <h3 className=" font-semibold">Additional Section</h3>
          <p className=" mt-2">
            This is an additional section below the list. You can add any other
            content or elements here.
          </p>
        </div>
      </div>
    </>
  );
};

export default Projects;
