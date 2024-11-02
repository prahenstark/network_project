import Navbar from "@/components/navbar";
import ToggleHeader from "@/components/toggle-header";
import Dropdown from "@/components/ui/dropdown";
import { ChevronDown } from "lucide-react";
import { FileInput } from "lucide-react";

export default function Accounts({}) {
  return (
    <div>
      <Navbar title="Accounts" />
      <ToggleHeader pageName="Account List" className=" p-6">
        <Dropdown className="border-green-500 h-9 w-20">
          <FileInput size={18} />
          <ChevronDown size={18} />
        </Dropdown>
      </ToggleHeader>
    </div>
  );
}
