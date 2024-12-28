"use client";
import { useUIState } from "@/hooks/use-uiState";
import { ScreenShareIcon, UserIcon, AlignLeft, XIcon } from "lucide-react";
import { useState } from "react";
import UserProfileModal from "./user-profile-modal";

export default function Navbar({ title = "Dashboard" }) {
  const { sidebarOpen, setSidebarOpen } = useUIState();
  const [isAddModalOpen, setAddModalOpen] = useState(false);
  const [isIframeOpen, setIframeOpen] = useState(false);

  return (
    <>
      <nav className="h-20 px-6 py-4 flex justify-between items-center">
        <div className="gap-x-2 justify-center items-center flex">
          <button
            onClick={() => {
              setSidebarOpen(!sidebarOpen);
            }}
          >
            <AlignLeft size={28} />
          </button>
          <h1 className="text-lg md:text-2xl font-semibold">{title}</h1>
        </div>
        <div className="gap-x-2 justify-center items-center flex">
          <button
            className="bg-foreground size-10 rounded-full text-background flex justify-center items-center cursor-pointer"
            onClick={() => setAddModalOpen(true)}
          >
            <UserIcon />
          </button>
          <button
            className="bg-foreground size-10 rounded-full text-background flex justify-center items-center cursor-pointer"
            onClick={() => setIframeOpen(true)}
          >
            <ScreenShareIcon />
          </button>
        </div>
      </nav>

      {/* Modals */}
      <UserProfileModal
        isOpen={isAddModalOpen}
        onClose={() => setAddModalOpen(false)}
      />

      {/* Iframe */}
      {isIframeOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50 overflow-y-hidden">
          <div className="relative w-full h-full">
            <button
              onClick={() => setIframeOpen(false)}
              className="absolute top-2 right-2 bg-gray-800 text-white rounded-full p-2 z-10 hover:bg-gray-700"
            >
              <XIcon className="w-5 h-5" />
            </button>
            <iframe
              id="preview-frame"
              src="http://103.243.43.102/login.htm"
              name="preview-frame"
              frameBorder="0"
              noResize="noresize"
              style={{
                width: "100vw",
                height: "100vh",
                borderRadius: "8px",
                border: "none",
              }}
            ></iframe>
          </div>
        </div>
      )}
    </>
  );
}
