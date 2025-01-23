"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectItem from "@/components/project-item";
import Loader from "@/components/loader";
import { fetchDashboardInfo } from "@/lib/api";
import { PlusIcon } from "lucide-react";
import AddProjectModal from "@/components/projects/add-project-modal";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null); // State to hold project data
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); // State for search input

  const getData = async () => {
    try {
      setLoading(true); // Start loading
      const data = await fetchDashboardInfo("/project"); // Adjust the API path as necessary
      setProjectData(data?.workgroupInfo || []); // Use optional chaining and default to an empty array
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  useEffect(() => {
    getData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-full">
        <Loader />
      </div>
    );
  }

  if (!projectData?.length) {
    return (
      <div className="flex justify-center items-center h-full">
        <p>No Projects Available</p>
      </div>
    );
  }

  // Extract the first project (parent project)
  const parentProject = projectData[0];
  const childProjects = parentProject?.child || [];

  // Filter projects based on the search query
  const filteredProjects = childProjects.filter((project) =>
    project.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <Navbar title="Projects" />

      {/* Page Info */}
      <div className="px-4 space-y-6 w-full mx-auto">
        <div className="p-4 md:mx-6 space-y-6">
          {/* Top Section for Parent Project */}
          <div className="flex items-center justify-between py-4 text-white rounded-lg h-10">
            <h2 className="text-lg font-semibold">{parentProject?.name}</h2>
            <button
              className="bg-green-500 h-10 w-10 rounded-lg"
              onClick={() => setAddModalOpen(true)}
            >
              <PlusIcon className="mx-auto" size={25} />
            </button>
          </div>

          {/* Search Bar */}
          <div className="py-4">
            <Input
              type="text"
              placeholder="Search projects..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-12 bg-green-900/40"
            />
          </div>

          {/* Section with List */}
          <div className="p-4 shadow-md rounded-lg bg-white bg-opacity-5">
            {filteredProjects.length > 0 ? (
              <ul className="space-y-2">
                {filteredProjects.map((project) => (
                  <ProjectItem
                    key={project.gid}
                    item={project.name}
                    id={project.gid}
                    refreshAction={getData}
                    child={project.child}
                  />
                ))}
              </ul>
            ) : (
              <p>No matching projects found.</p>
            )}
          </div>

          {/* Another Rounded Corner Section */}
          <div className="p-4 bg-white bg-opacity-5 shadow-md rounded-lg">
            <h3 className="font-semibold">Additional Section</h3>
            <p className="mt-2">
              This is an additional section below the list. You can add any
              other content or elements here.
            </p>
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddProjectModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
        name={parentProject?.name}
        refreshAction={getData}
        id={parentProject?.gid}
      />
    </>
  );
};

export default Projects;
