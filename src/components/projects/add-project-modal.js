import { useToast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { XIcon } from "lucide-react";
import React, { useState } from "react";

const AddProjectModal = ({ isOpen, onClose, id, name, refreshAction }) => {
  const { toast } = useToast();

  const [formData, setFormData] = useState({
    projectName: "",
    projectNotes: "",
  });

  if (!isOpen) return null;

  const handleChange = async (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API
    const apiData = {
      name: formData.projectName,
      description: "desc",
      gid: id,
    };

    try {
      // Use fetchDashboardInfo for POST request
      const response = await fetchDashboardInfo(
        "/project/add",
        "POST",
        apiData
      );
      console.log("api data", apiData);
      if (response) {
        toast({
          title: "Project Created!",
          description: "Successfully created the project.",
        });
        setFormData({
          projectName: "",
          projectNotes: "",
        });
        refreshAction();
        onClose(); // Close the modal after successful deletion
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to create the project.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
      setFormData({
        projectName: "",
        projectNotes: "",
      });
      onClose();
    }
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();

  //   // Prepare data for API
  //   const apiData = {
  //     name: formData.projectName,
  //     description: formData.projectNotes,
  //     gid: id,
  //   };

  //   console.log("api data", apiData);
  // };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Modal
  return (
    <div
      onClick={handleOverlayClick}
      className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] mx-6 p-8 rounded-lg relative shadow-lg">
        <div className="flex item-center justify-between mb-6">
          <h2 className="text-xl font-semibold">System Tips</h2>
          <button onClick={onClose} className=" hover:text-gray-400">
            <XIcon />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4 items-center justify-center"
        >
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Superior Project</label>
            <h1 className="w-1/2">{name}</h1>
          </div>
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Project Name</label>
            <input
              type="text"
              name="projectName"
              value={formData.projectName}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 text-white bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200"
              required
              maxLength="10"
            />
          </div>
          <div className="w-full flex">
            <label className="w-1/2">Project Notes</label>
            <textarea
              name="projectNotes"
              value={formData.projectNotes}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 text-white bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200 "
              rows="3"
              required
            />
          </div>
          {/* <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </div> */}

          <div className={`flex space-x-4 mt-4 justify-center`}>
            <button
              onClick={onClose}
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
      </div>
    </div>
  );
};

export default AddProjectModal;
