/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import NavUser from "./NavUser";
import ToggleDark from "./ToggleDark";

function Navbar() {
  const { setMe, me } = useContext(MainContext) as MainContext;

  useEffect(() => {
    api.get("/me").then(response => {
      setMe(response.data.data.user);
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
        {me?.id ? (
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
