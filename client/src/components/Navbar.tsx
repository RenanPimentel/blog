import React from "react";
import { Link } from "react-router-dom";
import ToggleDark from "./ToggleDark";

function Navbar() {
  return (
    <nav className="nav">
      <ul className="links">
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        <li>
          <Link className="link" to="/me">
            Me
          </Link>
        </li>
        <li>
          <Link className="link" to="/register">
            Register
          </Link>
        </li>
      </ul>
      <ToggleDark />
    </nav>
  );
}

export default Navbar;
