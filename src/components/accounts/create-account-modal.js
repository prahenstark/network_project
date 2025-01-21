"use client";
import React, { useState } from "react";
import ToggleNav from "../toggle-nav";
import CreateAccountForm from "./create-account-form";
import RegisterAccountForm from "./register-account-form";
import { XIcon } from "lucide-react";

const CreateAccountModal = ({ isOpen, onClose }) => {
  // const tabs = ["Create Account", "Registered Account"];
  const tabs = ["Create Account"];


  const [activeTab, setActiveTab] = useState("Create Account");

  if (!isOpen) return null;

  const tabsContent = {
    "Create Account": <CreateAccountForm onClose={onClose} />,
    // "Registered Account": <RegisterAccountForm onClose={onClose} />,
  };

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  // Modal
  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg overflow-scroll scrollbar-hide">
        {/* Header Modal */}
        <div className="flex item-center justify-between mb-6">
          <button onClick={onClose} className=" hover:text-gray-400 ml-auto">
            <XIcon />
          </button>
        </div>
        <ToggleNav
          className="h-12 min-w-[50vw]"
          tabs={tabs}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        {tabsContent[activeTab]}
      </div>
    </div>
  );
};

export default CreateAccountModal;
