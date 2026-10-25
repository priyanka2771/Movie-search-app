import React, { useState } from "react";

function SearchBar({ setSearchTerm }) {
  const [input, setInput] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() !== "") {
      setSearchTerm(input.trim());
    }
  };

  return (
    <form onSubmit={handleSubmit} className="search-bar">
      <span className="search-icon" aria-hidden="true">
        🔍
      </span>
      <input
        type="text"
        placeholder="Search for movies, series..."
        value={input}
        onChange={(e) => setInput(e.target.value)}
        aria-label="Search movies"
      />
      <button type="submit" className="search-btn">
        Search
      </button>
    </form>
  );
}

export default SearchBar;
