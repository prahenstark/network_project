import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SelectDropdown({ className, options = [] }) {
  return (
    <Select>
      <SelectTrigger className={`min-h-9 bg-white bg-opacity-5 ${className}`}>
        <SelectValue placeholder="Theme" />
      </SelectTrigger>
      <SelectContent>
        {options.map((option, index) => (
          <SelectItem key={index}>{option}</SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

export default SelectDropdown;
