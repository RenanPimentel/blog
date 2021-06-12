import React from "react";
import { Link } from "react-router-dom";
function ErrorPage() {
  return (
    <div className="wrapper">
      <h1>Page not found</h1>
      <Link className="btn" to="/">
        Go Back
      </Link>
    </div>
  );
}

export default ErrorPage;
