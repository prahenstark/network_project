"use client"
import { useUIState } from "@/hooks/use-uiState";
import { ScreenShareIcon } from "lucide-react";
import { UserIcon } from "lucide-react";
import { AlignLeft } from "lucide-react"; 

export default function Navbar({title="Dashboard"}) {
  const { sidebarOpen, setSidebarOpen } = useUIState();

  return (
    <nav className="h-20 px-6 py-4 flex justify-between items-center">
      <div className="gap-x-2 justify-center items-center flex">
        <button onClick={() => {setSidebarOpen(!sidebarOpen)}}><AlignLeft size={28} /></button>{" "}
        <h1 className=" text-lg md:text-2xl font-semibold">{title}</h1>
      </div>
      <div className="gap-x-2 justify-center items-center flex">
        <button className="bg-foreground size-10 rounded-full text-background flex justify-center items-center cursor-pointer">
          <UserIcon />
        </button>
        <button className="bg-foreground size-10 rounded-full text-background flex justify-center items-center cursor-pointer">
          <ScreenShareIcon />
        </button>
      </div>
    </nav>
  );
}