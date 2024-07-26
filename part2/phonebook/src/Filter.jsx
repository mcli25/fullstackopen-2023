import React from "react";

const Filter = ({ filteredName, handleFilteredNameChange }) => {
  return (
    <div>
      filter shown with:
      <input value={filteredName} onChange={handleFilteredNameChange} />
    </div>
  );
};

export default Filter;
