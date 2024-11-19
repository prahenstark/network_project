"use client";
import React, { useState } from "react";
import CreateAccountForm from "../accounts/create-account-form";
import RegisterAccountForm from "../accounts/register-account-form";
import AccessPointForm from "./access-point-form";
import GatewayForm from "./gateway-form";
import { XIcon } from "lucide-react";

const AddDeviceModal = ({ isOpen, onClose, projectData }) => {
  const [selectedForm, setSelectedForm] = useState("Access Point");

  if (!isOpen) return null;

  const types = {
    "Access Point": <AccessPointForm onClose={onClose} projectData={projectData} />,
    Gateway: <GatewayForm projectData={projectData} />,
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleFormChange = (e) => {
    setSelectedForm(e.target.value);
  };

  // Modal
  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg w-full max-w-2xl">
        {/* Header Modal */}
        <div className="flex item-center justify-between mb-6">
          <button
            onClick={onClose}
            className=" hover:text-gray-400"
          >
            <XIcon />
          </button>
        </div>

        {/* Dropdown for selecting the form */}
        <div className="">
          <label
            htmlFor="formSelect"
            className="block text-xl font-medium text-white mb-4"
          >
            Select Type
          </label>
          <select
            id="formSelect"
            value={selectedForm}
            onChange={handleFormChange}
            className="block w-full bg-white bg-opacity-5 border-2 border-green-500 text-white p-2 rounded-lg focus:ring focus:ring-green-500 focus:outline-none"
          >
            {Object.keys(types).map((key) => (
              <option
                className="bg-white bg-opacity-5 text-black"
                key={key}
                value={key}
              >
                {key}
              </option>
            ))}
          </select>
        </div>

        {/* Render the selected form */}
        <div>{types[selectedForm]}</div>
      </div>
    </div>
  );
};

export default AddDeviceModal;
