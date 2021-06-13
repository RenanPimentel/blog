import React from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/context";
import ToggleDark from "./ToggleDark";

function Navbar() {
  const context = useContext(MyContext) as MainContext;

  return (
    <nav className="nav">
      <ul className="links">
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        {context.me?.id ? (
          <li>
            <Link className="link" to="/me">
              Me
            </Link>
          </li>
        ) : (
          <>
            <li>
              <Link className="link" to="/register">
                Register
              </Link>
            </li>
            <li>
              <Link className="link" to="/login">
                Login
              </Link>
            </li>
          </>
        )}
      </ul>
      <ToggleDark />
    </nav>
  );
}

export default Navbar;
