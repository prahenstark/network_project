"use client";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

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

  return (
    <div
      onClick={handleOverlayClick}
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50"
    >
      <div className="bg-[#303531] p-8 rounded-lg relative shadow-lg">
        <button
          onClick={onClose}
          className="absolute top-3 right-4 hover:text-gray-800"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Warning</h2>
        <form
          onSubmit={handleLogout}
          className="w-[30vw] h-[20vh] flex flex-col gap-4 items-center justify-center"
        >
          <h1 className="w-full">Are you sure you want to logout?</h1>
          <div className="flex space-x-4 mt-4 justify-center">
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
