"use client";
import { useToast } from "@/hooks/use-toast";
import { XIcon } from "lucide-react";
import { useRouter } from "next/navigation";

// Modal
const LogoutModal = ({ isOpen, onClose }) => {
  const { toast } = useToast();
  const router = useRouter();

  if (!isOpen) return null;

  const handleLogout = async (e) => {
    e.preventDefault();

    try {
      window.localStorage.removeItem("bearerToken");
      toast({
        description: "Sucessfully logged you out!",
      });
      router.push("/auth/login");
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
      <div className="bg-[#303531] w-[80%] max-w-lg p-8 rounded-lg relative shadow-lg">
        {/* Header Modal */}
        <div className="flex item-center justify-between mb-6">
          <h2 className="text-xl font-semibold">Warning</h2>
          <button
            onClick={onClose}
            className=" hover:text-gray-400"
          >
            <XIcon />
          </button>
        </div>

        <form
          onSubmit={handleLogout}
          className="flex flex-col gap-4 items-center justify-center"
        >
          <h1 className="w-full text-center">
            Are you sure you want to logout?
          </h1>
          <div className="flex flex-wrap gap-4 mt-4 justify-center">
            <button
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

export default LogoutModal;
