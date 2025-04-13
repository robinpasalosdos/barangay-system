import React from "react";

const SearchBar = ({ searchQuery, setSearchQuery, placeholder }) => {
  return (
    <input
      type="text"
      placeholder={placeholder || "Search..."}
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      className="search-input"
      style={{width: "300px"}}
    />
  );
};

export default SearchBar;