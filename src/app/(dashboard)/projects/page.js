// src/pages/MyPage.js
"use client";
import React, { useEffect, useState } from "react";
import Navbar from "@/components/navbar";
import ProjectItem from "@/components/project-item";
import { Plus } from "lucide-react";
import Link from "next/link";
import AddProjectModal from "@/components/projects/add-project-modal";
import CreateAccountModal from "@/components/accounts/create-account-modal";
// import { useDevice } from "@/context/device-context";
import Loader from "@/components/loader";
import { fetchDashboardInfo } from "@/lib/api";

const Projects = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const [loading, setLoading] = useState(true);
  const [projectData, setprojectData] = useState(null); // State to hold device data
  // const { selectedProject } = useDevice();

  // function getProjectNames(data) {
  //   const result = [];

  //   console.log("all data", data);

  //   data.forEach((workgroup) => {
  //     // Add the parent project name
  //     result.push(workgroup?.name);

  function getProjectNames(data) {
    const result = [];

    data?.forEach((workgroup) => {
      // Add the parent project name and id
      result.push({ id: workgroup.gid, name: workgroup.name });

      // Function to recursively get child project names and ids
      function getChildNames(children) {
        children.forEach((child) => {
          // Push child project name and id
          result.push({ id: child.gid, name: child.name });

          // If the child has its own children, call the function recursively
          if (child.child && child.child.length > 0) {
            getChildNames(child.child);
          }
        });
      }

      // Get names and ids of all child projects
      getChildNames(workgroup.child);
    });

    return result;
  }

  const projectNames = getProjectNames(projectData);
  // console.log("all data", projectNames);
  

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/project"); // Adjust the API path as necessary
        // console.log("all data", data);
        setprojectData(data?.workgroupInfo || []); // Use optional chaining and default to an empty array
        // console.log("workgroupInfo", data);
      } catch (error) {
        console.log("Failed to fetch devices data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getData();
  }, []);

  // Sample array to map over
  const items = ["Item 1", "Item 2", "Item 3", "Item 4", "Item 5"];

  return (
    <>
      <Navbar title="Projects" />

      {/* Page Info */}
      <div className="px-4 space-y-6 w-full mx-auto">
        <div className="p-4 mx-6 space-y-6">
          {/* Top Horizontal Section */}
          <div className="flex items-center justify-between p-4 text-white rounded-lg">
            {/* Left: Static Page Name */}
            <h2 className="text-lg font-semibold">Projects List</h2>

            {/* Right: Button */}
            {/* <Link className="my-2" href={""} onClick={openModal}>
              <div className="icon p-2 border w-full bg-green-500 hover:bg-white hover:text-black border-transparent hover:border-border rounded-sm transition">
                <Plus size={20} />
              </div>
            </Link>

            <CreateAccountModal isOpen={isModalOpen} onClose={closeModal} /> */}

            {/* <AddProjectModal
              isOpen={isModalOpen}
              onClose={closeModal}
            /> */}
          </div>

          {/* Section with List */}
          <div className="p-4 shadow-md rounded-lg bg-white bg-opacity-5">
            {loading ? (
              <div className="flex justify-center items-center h-full">
                <Loader /> {/* Display your Loader component here */}
              </div>
            ) : (
              <>
                {/* <h3 className="font-semibold mb-3">Project List</h3> */}
                <ul className="space-y-2">
                    { projectNames.map(project => (<ProjectItem key={project.id} item={project.name} id={project.id}/>))}
                </ul>
              </>
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
    </>
  );
};

export default Projects;
