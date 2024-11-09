import { DropdownMenu } from "@radix-ui/react-dropdown-menu";
import React from "react";
import {
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

function IconDropdown({ className, children, onSelect, disabled = false, options = [] }) {
  return (
    <DropdownMenu>
      {/* Check if options is empty */}
      {disabled === true ? (
        <DropdownMenuTrigger
          className={`min-h-9 flex items-center justify-between px-2 border-2 rounded-md text-white ${className} opacity-50 cursor-not-allowed`}
        >
          {children}
        </DropdownMenuTrigger>
      ) : (
        <>
          <DropdownMenuTrigger
            className={`min-h-9 flex items-center justify-between px-2 border-2 rounded-md text-white ${className}`}
          >
            {children}
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {/* Map over options to create DropdownMenuItems dynamically */}
            {options.map((option, index) => (
              <DropdownMenuItem
                key={index}
                disabled={disabled}
                onClick={() => onSelect(option)}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </>
      )}
    </DropdownMenu>
  );
}

export default IconDropdown;
