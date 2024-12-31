import { useToast } from "@/hooks/use-toast";
import { fetchDashboardInfo } from "@/lib/api";
import { XIcon } from "lucide-react";
import React, { useEffect, useState } from "react";

const UserProfileModal = ({ isOpen, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState(null); // State to hold project data
  const { toast } = useToast();

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true); // Start loading
        const data = await fetchDashboardInfo("/info"); // Call the fetch function
        setUserData(data?.dashboardData?.userInfo);
      } catch (error) {
        console.log("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false); // Stop loading
      }
    };

    getData();
  }, []);

  if (!isOpen) return null;

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
      <div className="bg-[#303531] mx-6 p-8 rounded-lg relative shadow-lg w-full max-w-md">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-white">Profile Info</h2>
          <button onClick={onClose} className="hover:text-gray-400">
            <XIcon className="w-6 h-6 text-white" />
          </button>
        </div>
        <div className="flex flex-col items-center p-10 mb-4">
          <div className="w-24 h-24 rounded-full bg-gray-700 mb-6 flex items-center justify-center text-white text-xl">
            {userData?.nickname?.charAt(0)?.toUpperCase() || "U"}
          </div>
          <h3 className="text-lg font-medium text-white mb-2">
            Hi {userData?.nickname || "Nickname"} !
          </h3>
          <p className="text-sm text-gray-300 mb-1">
            <span className="font-semibold">Name:</span>{" "}
            {userData?.username || "N/A"}
          </p>
          <p className="text-sm text-gray-300">
            <span className="font-semibold">Email:</span>{" "}
            {userData?.email || "N/A"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileModal;
