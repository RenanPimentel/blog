import React, { useEffect, useState } from "react";
import { useContext } from "react";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom";
import { MainContext } from "../context/context";

function SearchBar() {
  const { me } = useContext(MainContext);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!me.id) {
      setError(true);
      return;
    }
    setQuery(e.target.value);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      setError(true);
    } else {
      setError(false);
      setQuery(query.trim());
      history.push(`/search?query=${query.trim()}`);
    }
  };

  useEffect(() => {
    if (query) setError(false);
  }, [query]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <div className={`search-input-container ${error ? "border-red" : ""}`}>
        <input
          className={`search-input `}
          type="text"
          value={query}
          onChange={handleInputChange}
        />
        <button type="submit" className="link">
          <FaSearch />
        </button>
      </div>
    </form>
  );
}

export default SearchBar;
