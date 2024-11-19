import { fetchDashboardInfo } from "@/lib/api";
import React, { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";

const DeleteAccountModal = ({ isOpen, onClose, id, name, refreshAction }) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prepare data for API
    // const apiData = `gid=${id}`;

    const apiData = {
      gid: id,
    };

    try {
      // Send API call to delete the user with the provided UID
      const result = await fetchDashboardInfo(
        "/project/delete",
        "DELETE",
        apiData
      );

      if (result) {
        toast({
          title: "Project deleted!",
          description: "Successfully deleted the selected project.",
        });
        refreshAction()
        onClose(); // Close the modal after successful deletion
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to delete the project.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    }
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
      className=" fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className=" absolute top-3 right-3  hover:text-gray-400"
        >
          <XIcon />
        </button>
        <h2 className="text-lg font-semibold mb-4">System Tips</h2>
        <form
          onSubmit={handleSubmit}
          className="w-[30vw] h-[25vh] flex flex-col gap-6 items-center justify-center"
        >
          <h1>Are you sure you want to delete this project?</h1>

          <div className={`flex space-x-4 mt-4 justify-center`}>
            <button
              onClick={onClose}
              className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
            >
              No
            </button>
            <button
              type="submit"
              className="min-w-32 px-4 py-2 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
            >
              Yes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteAccountModal;
