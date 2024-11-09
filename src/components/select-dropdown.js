import React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

function SelectDropdown({ className, disabled, options = [] }) {
  return (
    <Select>
      {/* Check if options is empty */}
      {disabled === true ? (
        <SelectTrigger
          className={`min-h-9 bg-white bg-opacity-5 border-0 ${className} opacity-50 cursor-not-allowed`}
        >
          <SelectValue placeholder={options[0].label} />
        </SelectTrigger>
      ) : (
        <>
          <SelectTrigger
            className={`min-h-9 bg-white bg-opacity-5 border-0 ${className}`}
          >
            <SelectValue placeholder={options[0].label} />
          </SelectTrigger>
          <SelectContent>
            {/* Map through options to create SelectItem dynamically */}
            {options.map((option, index) => (
              <SelectItem key={index} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </>
      )}
    </Select>
  );
}

export default SelectDropdown;
