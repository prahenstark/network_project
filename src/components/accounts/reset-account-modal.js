import { useToast } from "@/hooks/use-toast";
import React, { useState } from "react";
import { fetchDashboardInfo } from "@/lib/api"; // Adjust the path accordingly
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { XIcon } from "lucide-react";

const ResetAccountModal = ({ isOpen, onClose, gids }) => {
  // State to hold the password input
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if UID is provided
    if (!gids) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Please select an account to update the account.",
      });
      return;
    }

    console.log(gids);

    // Check if password is provided
    if (!password) {
      toast({
        title: "Error",
        description: "New password is required to reset the account.",
        variant: "destructive",
      });
      return;
    }

    const postData = {
      uids: gids, // Using gids prop to send multiple UIDs
      password: password,
    };
    console.log(postData);
    try {
      // Send API call to reset the password with the provided gids and password
      const result = await fetchDashboardInfo(
        "/cloudnet/portal/dashboard/account/reset-passwords",
        "PUT",
        postData
      );

      if (result) {
        toast({
          title: "Password reset successful!",
          description:
            "Successfully reset the password for the selected account(s).",
        });
        onClose(); // Close the modal after successful reset
        window.location.reload(); // Refresh the page after successful reset
      }
    } catch (error) {
      console.log(error);
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
      <div className="bg-[#303531] p-8 mx-6 rounded-lg relative shadow-lg">
        {/* Header Modal */}
        <div className="flex item-center justify-between mb-6">
          <h2 className="text-xl font-semibold">System Tips</h2>
          <button onClick={onClose} className=" hover:text-gray-400">
            <XIcon />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center justify-center"
        >
          <h1 className="w-full">
            Do you want to reset the password of the selected account(s)?
          </h1>

          {/* Input field for password */}
          <div className=" w-full">
            <Label
              htmlFor="password"
              className="block text-sm font-medium text-white mb-2"
            >
              Enter New Password:
            </Label>
            <Input
              type="password"
              id="password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 text-white bg-white bg-opacity-5 rounded-md"
            />
          </div>

          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <button
              onClick={onClose}
              className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
            >
              No
            </button>
            <button
              type="submit"
              disabled={!password}
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

export default ResetAccountModal;
