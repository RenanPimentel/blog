import React, { useEffect, useState } from "react";
import { FaSearch } from "react-icons/fa";
import { useHistory } from "react-router-dom";

function SearchBar() {
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);
  const history = useHistory();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value.trim());
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!query) {
      setError(true);
    } else {
      setError(false);
      history.push(`/search?query=${query}`);
    }
  };

  useEffect(() => {
    if (query) setError(false);
  }, [query]);

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      {error ? (
        <input
          type="text"
          className="textarea border-red"
          value={query}
          onChange={handleInputChange}
        />
      ) : (
        <input
          type="text"
          className="textarea"
          value={query}
          onChange={handleInputChange}
        />
      )}
      <button type="submit" className="link">
        <FaSearch />
      </button>
    </form>
  );
}

export default SearchBar;
