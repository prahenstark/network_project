import React from 'react'
import { Input } from './ui/input'

function Searchbar({displayText, className, onChange }) {
  return (
    <Input
      onChange={onChange}
      type="text"
      placeholder={displayText}
      className={`min-h-9 min-w-80 bg-white bg-opacity-5  ${className}`}
    />
  );
}

export default Searchbar