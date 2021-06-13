/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/context";
import { api } from "../util/api";
import NavUser from "./NavUser";
import ToggleDark from "./ToggleDark";

function Navbar() {
  const context = useContext(MyContext) as MainContext;

  useEffect(() => {
    api.get("/me").then(response => {
      context.setMe(response.data.user);
    });
  }, []);

  return (
    <nav className="nav">
      <ul className="links">
        <li>
          <Link className="link" to="/">
            Home
          </Link>
        </li>
        {context.me?.id ? (
          <NavUser />
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
