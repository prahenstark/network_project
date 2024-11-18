"use client";
import React, { useEffect, useState } from "react";
import { fetchDashboardInfo } from "@/lib/api";

function GatewayForm({ onClose }) {
  const [formData, setFormData] = useState({
    location: "",
    deviceId: "",
    gid: "",
  });

  const handleChange = (e) => {
    const { name, type, value } = e.target;

    if (name === "gid") {
      setFormData((prevData) => ({
        ...prevData,
        gid: value, // Set gid to the selected value
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const apiData = {
      type: "gateway",
      location: formData.location,
      deviceId: formData.deviceId,
      gid: formData.gid,
    };

    try {
      const response = await fetchDashboardInfo(
        "/device/bind",
        "POST",
        apiData
      );
      console.log("gateway api data", apiData);
      console.log("API Response:", response);
      alert("Device added successfully!");
      onClose();
    } catch (error) {
      console.error("Error adding device:", error);
      alert("There was an error adding the device.");
    }
  };

  const handleCancel = () => {
    onClose();
  };

//   const getProjectData = async () => {
//     try {
//       setLoading(true);
//       const data = await fetchDashboardInfo("/project");
//       setProjectData(data?.workgroupInfo || []);
//     } catch (error) {
//       console.error("Failed to fetch project data:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     getProjectData();
//   }, []);

  // Recursive component for rendering projects and their children
  const ProjectHierarchy = ({ projects }) => {
    return (
      <ul className="ml-4 border-l border-gray-600 pl-4">
        {projects.map((project) => (
          <li key={project.gid} className="my-2">
            <label className="flex items-center">
              <input
                type="radio" // Changed to radio button for single selection
                name="gid"
                value={project.gid}
                checked={formData.gid === project.gid}
                onChange={handleChange}
                className="mr-2"
              />
              {project.name}
            </label>
            {project.child?.length > 0 && (
              <ProjectHierarchy projects={project.child} />
            )}
          </li>
        ))}
      </ul>
    );
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="w-full flex flex-col gap-3 items-center justify-between px-8 py-4 text-white"
    >
      {/* Input Fields */}



      <div className="w-full flex items-center justify-center">
        <label className="w-1/2 block text-sm font-medium mb-1">Location</label>
        <input
          type="text"
          name="location"
          value={formData.location}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className="w-1/2 block text-sm font-medium mb-1">
          Device ID
        </label>
        <input
          type="text"
          name="deviceName"
          value={formData.deviceId}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className="w-1/2 block text-sm font-medium mb-1">Gid</label>
        <input
          type="text"
          name="gid"
          value={formData.gid}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200"
          required
        />
      </div>

      {/* Binding Projects */}
      {/* <div className="w-full flex items-start justify-center mt-2">
        <span className="w-1/2 block text-sm font-medium">Binding Project</span>
        <div className="w-full flex flex-col items-start">
          <div className="w-full flex items-start justify-center mt-2">
            <div className="w-full max-h-20 flex flex-col items-start overflow-y-auto">
              {loading ? (
                <p>Loading projects...</p>
              ) : projectData?.length > 0 ? (
                <ProjectHierarchy projects={projectData} />
              ) : (
                <p className="text-gray-400">No Projects Available</p>
              )}
            </div>
          </div>
        </div>
      </div> */}

      {/* Buttons */}
      <div className={`flex space-x-6 mt-4`}>
        <button
          onClick={handleCancel}
          className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="min-w-32 px-4 py-2 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
        >
          Submit
        </button>
      </div>
    </form>
  );
}

export default GatewayForm;