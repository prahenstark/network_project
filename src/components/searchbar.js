import React from 'react'
import { Input } from './ui/input'

function Searchbar({displayText, className }) {
  return (
    <Input
      type="text"
      placeholder={displayText}
      className={`min-h-9 bg-white bg-opacity-5 min-w-80 ${className}`}
    />
  );
}

export default Searchbar