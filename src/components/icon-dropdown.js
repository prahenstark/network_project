import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function IconDropdown({ className, children, options = [] }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={`min-h-9 flex items-center justify-between px-2 py-3 border-2 rounded-md text-white ${className}`}
      >
        {children}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        {/* Map over options to create DropdownMenuItems dynamically */}
        {options.map((option, index) => (
          <DropdownMenuItem key={index}>{option}</DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default IconDropdown;
