import React from "react";
import { useLocation } from "react-router-dom";

function SearchPage() {
  const locationSearch = useLocation().search;
  const query = new URLSearchParams(locationSearch).get("query");

  return <main className="wrapper">search {query}</main>;
}

export default SearchPage;
