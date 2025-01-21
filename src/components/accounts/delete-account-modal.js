import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { fetchProtectedInfo } from "@/lib/api";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { XIcon } from "lucide-react";

const DeleteModal = ({ isOpen, onClose, gids }) => {
  const { toast } = useToast();
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if UID is provided
    if (!gids) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an account to delete the account.",
      });
      return;
    }

    console.log("GIDS", gids);

    try {
      // Send API call to delete the user with the provided UID
      const result = await fetchProtectedInfo(
        "cloudnet/portal/dashboard/account/delete-users",
        "DELETE",
        {
          uids: gids,
        }
      );

      if (result) {
        toast({
          title: "Account deleted!",
          description: "Successfully deleted the selected account.",
        });
        onClose(); // Close the modal after successful deletion
        window.location.reload();
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description:
            "Failed to delete the account. Please provide correct gid.",
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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8  mx-6 rounded-lg relative shadow-lg">
        {/* Header Modal */}
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
          <h1 className="w-full text-center">
            Do you want to delete the selected account?
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <button
              type="button"
              onClick={onClose}
              className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
            >
              No
            </button>
            <button
              type="submit"
              className="min-w-32 px-4 py-2 disabled:bg-green-600/20 disabled:text-white/50 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
            >
              Yes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default DeleteModal;
