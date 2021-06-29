import React, { useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    history.push(`/search?query=${query}`);
    setQuery("");
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        className="textarea"
        value={query}
        onChange={handleInputChange}
      />
      <button type="submit" className="link">
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
