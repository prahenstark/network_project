import { toast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const HandoverModal = ({ isOpen, onClose, id, refreshAction }) => {
  const [formData, setFormData] = useState({
    selectedUser: "", // Stores the selected user's email
  });
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]); // Stores the user data

  useEffect(() => {
    const fetchData = async () => {
      const path = "/account?pageOffset=10&pageIndex=1&status=2";
      try {
        setLoading(true); // Start loading
        const response = await fetchDashboardInfo(path);
        setUsers(response?.users || []); // Extract users array
      } catch (error) {
        console.log("Error fetching data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    if (isOpen) {
      fetchData(); // Fetch data only when modal is open
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const selectedUserEmail = formData.selectedUser;
    if (!selectedUserEmail) {
      console.log("No user selected!");
      return;
    }

    console.log("Submitting handover to:", selectedUserEmail);

    const apiData = {
      email: selectedUserEmail,
    };

    try {
      // Send API call to delete the user with the provided UID
      const result = await fetchDashboardInfo(
        (createFinalPath = false),
        `/users/project/handover/${id}`,
        "PUT",
        apiData
      );

      if (result) {
        toast({
          title: "Project handovered!",
          description: "Successfully handovered the selected project.",
        });
        refreshAction();
        onClose(); // Close the modal after successful deletion
      } else {
        toast({
          title: "Error",
          variant: "destructive",
          description: "Failed to handover the project.",
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        variant: "destructive",
        description: "Something went wrong. Please try again later.",
      });
    }

    refreshAction();
    onClose();
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
      <div className="bg-[#303531] mx-6 p-8 rounded-lg relative shadow-lg w-[40rem] ">
        <div className="flex item-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Handover Project</h2>
          <button onClick={onClose} className="hover:text-gray-400">
            <XIcon />
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-6 items-center justify-center"
        >
          {/* Dropdown for User Selection */}
          <div className="w-full flex items-center justify-center">
            <label className="w-1/2">Account</label>
            <select
              name="selectedUser"
              value={formData.selectedUser}
              onChange={handleChange}
              className="w-1/2 px-3 py-2 bg-white bg-opacity-5 border rounded focus:outline-none focus:ring focus:ring-blue-200 text-white"
              required
            >
              <option
                value=""
                disabled
                className="bg-[#303531] text-white hover:bg-white hover:bg-opacity-5"
              >
                Select a user
              </option>
              {users.map((user) => (
                <option
                  key={user.uid}
                  value={user.email}
                  className="bg-[#303531] text-white hover:bg-white hover:bg-opacity-5"
                >
                  {user.nickname}
                </option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <button
              onClick={onClose}
              type="button"
              className="min-w-32 px-4 py-2 bg-transparent border-2 border-white border-opacity-5 rounded hover:bg-white hover:bg-opacity-5"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="min-w-32 px-4 py-2 bg-green-600 text-zinc-900 font-medium rounded hover:bg-green-300"
            >
              Apply
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default HandoverModal;
