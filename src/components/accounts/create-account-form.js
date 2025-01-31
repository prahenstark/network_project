"use client";
import React, { useEffect, useState } from "react";
import axios from "axios";
import { fetchDashboardInfo } from "@/lib/api";
import { useToast } from "@/hooks/use-toast";

function CreateAccountForm({ onClose }) {
  const [loading, setLoading] = useState(true);
  const [projectData, setProjectData] = useState(null);
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    account: "",
    nickName: "",
    password: "",
    mobile: "",
    email: "",
    role: "",
    status: "",
    gid: [],
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;

    if (type === "radio") {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    } else if (type === "checkbox") {
      setFormData((prevData) => {
        const updatedGid = checked
          ? [...prevData.gid, value] // Add value if checked
          : prevData.gid.filter((gid) => gid !== value); // Remove value if unchecked

        return {
          ...prevData,
          gid: updatedGid,
        };
      });
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
      role: formData.role === "admin" ? "2" : "1",
      enable: formData.status === "enable" ? "1" : "0",
      gids: formData.gid,
      nickname: formData.nickName,
      country: "IN",
      phone: formData.mobile,
      email: formData.email,
      username: formData.account,
      password: formData.password,
    };

    try {
      const response = await fetchDashboardInfo(
        "/account/add-users",
        "POST",
        apiData
      );
      console.log("api data", apiData);
      console.log("API Response:", response);
      toast({ description: "Account created successfully!" });
      window.location.reload();
      onClose();
    } catch (error) {
      console.error("Error creating account:", error);
      toast({
        description: "There was an error creating device.",
        variant: "destructive",
      });
    }
  };

  const handleCancel = () => {
    onClose();
  };

  const getProjectData = async () => {
    try {
      setLoading(true);
      const data = await fetchDashboardInfo("/project");
      setProjectData(data?.workgroupInfo || []);
    } catch (error) {
      console.error("Failed to fetch project data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getProjectData();
  }, []);

  // Recursive component for rendering projects and their children
  const ProjectHierarchy = ({ projects }) => {
    return (
      <ul className="ml-4 border-l border-gray-600 pl-4">
        {projects.map((project) => (
          <li key={project.gid} className="my-2">
            <label className="flex items-center">
              <input
                type="checkbox"
                name="gid" // Same name for all checkboxes
                value={project.gid} // Unique value for each checkbox
                checked={formData.gid.includes(project.gid)}
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
      className="w-full h-[80vh] flex flex-col gap-3 items-center justify-between p-8 text-white"
    >
      {/* Text Field */}
      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Account</label>
        <input
          type="text"
          name="account"
          value={formData.account}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 "
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">
          Nickname
        </label>
        <input
          type="text"
          name="nickName"
          value={formData.nickName}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 "
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">
          Password
        </label>
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 "
          required
        />
      </div>

      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Mobile</label>
        <input
          type="text"
          name="mobile"
          value={formData.mobile}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 "
          required
        />
      </div>
      <div className="w-full flex items-center justify-center">
        <label className=" w-1/2 block text-sm font-medium mb-1">Email</label>
        <input
          type="text"
          name="email"
          value={formData.email}
          onChange={handleChange}
          className="mt-1 block w-full text-white bg-white bg-opacity-5 border rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 "
          required
        />
      </div>

      {/* Radio Buttons */}
      <div className="w-full flex items-center justify-center">
        <span className=" w-1/2 block text-sm font-medium">Role</span>
        <div className="w-full flex items-start">
          <label className="mr-4">
            <input
              type="radio"
              name="role"
              value="guest"
              checked={formData.role === "guest"}
              onChange={handleChange}
              className="mr-1"
            />
            Guest
          </label>
          <label>
            <input
              type="radio"
              name="role"
              value="admin"
              checked={formData.role === "admin"}
              onChange={handleChange}
              className="mr-1"
            />
            Admin
          </label>
        </div>
      </div>

      <div className="w-full flex items-center justify-center">
        <span className=" w-1/2 block text-sm font-medium">Status</span>
        <div className="w-full flex items-start">
          <label className="mr-4">
            <input
              type="radio"
              name="status"
              value="enable"
              checked={formData.status === "enable"}
              onChange={handleChange}
              className="mr-1"
            />
            Enable
          </label>
          <label>
            <input
              type="radio"
              name="status"
              value="disable"
              checked={formData.status === "disable"}
              onChange={handleChange}
              className="mr-1"
            />
            Disable
          </label>
        </div>
      </div>

      {/* Checklist (Checkboxes) */}
      {/* <div className="w-full flex items-start justify-center mt-2">
        <span className="w-1/2 block text-sm font-medium">Binding Project</span>
        <div className="w-full flex flex-col items-start">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj1"
              onChange={handleChange}
              className="mr-2"
            />
            Proj 1
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj2"
              onChange={handleChange}
              className="mr-2"
            />
            Proj 2
          </label>
          <label className="flex items-center">
            <input
              type="checkbox"
              name="proj3"
              onChange={handleChange}
              className="mr-2"
            />
            Proj 3
          </label>
        </div>
      </div> */}

      <div className="w-full flex items-start justify-center mt-2">
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
      </div>

      {/* Buttons */}
      <div className={`flex space-x-6 mt-4`}>
        <button
          type="button"
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

export default CreateAccountForm;
