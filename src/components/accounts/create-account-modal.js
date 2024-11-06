import React, { useState } from "react";
import ToggleNav from "../toggle-nav";

const CreateAccountModal = ({ isOpen, onClose }) => {
  const tabs = ["Create Account", "Registered Account"];

  const [activeTab, setActiveTab] = useState("Create Account");

  const tabsContent = {
    "Create Account": <h1>Hello 1</h1>,
    "Registered Account": <h1>Hello 2</h1>,
  };

  const [formData, setFormData] = useState({
    name: "",
    gender: "",
    interests: {
      sports: false,
      music: false,
      travel: false,
    },
  });

  const handleChange = (e) => {
    const { name, type, value, checked } = e.target;
    if (type === "checkbox") {
      setFormData((prevData) => ({
        ...prevData,
        interests: {
          ...prevData.interests,
          [name]: checked,
        },
      }));
    } else {
      setFormData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitted Data:", formData);
  };

  const handleCancel = () => {
    setFormData({
      name: "",
      gender: "",
      interests: {
        sports: false,
        music: false,
        travel: false,
      },
    });
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className=" absolute top-3 right-3  hover:text-gray-800"
        >
          &times;
        </button>
        <ToggleNav
          className="h-12 w-[50vw]"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <form
          onSubmit={handleSubmit}
          className="w-full flex flex-col gap-4 items-center justify-center py-6 text-white"
        >
          {/* Text Field */}
          <div className="w-full flex items-center justify-center">
            <label className=" w-1/2 block text-sm font-medium mb-1">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:outline-none focus:ring focus:ring-blue-200 text-black"
              required
            />
          </div>

          {/* Radio Buttons */}
          <div className="w-full flex items-center justify-center">
            <span className=" w-1/2 block text-sm font-medium">Gender</span>
            <div className="w-full flex items-start">
              <label className="mr-4">
                <input
                  type="radio"
                  name="gender"
                  value="male"
                  checked={formData.gender === "male"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Male
              </label>
              <label>
                <input
                  type="radio"
                  name="gender"
                  value="female"
                  checked={formData.gender === "female"}
                  onChange={handleChange}
                  className="mr-1"
                />
                Female
              </label>
            </div>
          </div>

          {/* Checklist (Checkboxes) */}
          <div className="w-full flex items-start justify-center mt-2">
            <span className="w-1/2 block text-sm font-medium">Interests</span>
            <div className="w-full flex flex-col items-start">
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="sports"
                  checked={formData.interests.sports}
                  onChange={handleChange}
                  className="mr-2"
                />
                Sports
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="music"
                  checked={formData.interests.music}
                  onChange={handleChange}
                  className="mr-2"
                />
                Music
              </label>
              <label className="flex items-center">
                <input
                  type="checkbox"
                  name="travel"
                  checked={formData.interests.travel}
                  onChange={handleChange}
                  className="mr-2"
                />
                Travel
              </label>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={handleCancel}
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
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateAccountModal;
