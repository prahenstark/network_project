import { ScreenShareIcon } from "lucide-react";
import { UserIcon } from "lucide-react";
import { AlignLeft } from "lucide-react"; 

export default function Navbar({title="Dashboard"}) {
  return (
    <nav className="h-20 px-6 flex justify-between items-center">
      <div className="gap-x-2 justify-center items-center flex">
        <AlignLeft size={28} /> <h1 className="text-2xl font-semibold">{title}</h1>
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