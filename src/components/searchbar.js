import React from 'react'
import { Input } from './ui/input'

function Searchbar({displayText, className, onChange }) {
  return (
    <Input
      onChange={onChange}
      type="text"
      placeholder={displayText}
      className={`bg-white bg-opacity-5  ${className}`}
    />
  );
}

export default Searchbar