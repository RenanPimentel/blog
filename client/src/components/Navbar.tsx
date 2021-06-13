/* eslint-disable no-restricted-globals */
import React, { useEffect } from "react";
import { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { MyContext } from "../context/context";
import { api } from "../util/api";
import ToggleDark from "./ToggleDark";

function Navbar() {
  const history = useHistory();
  const context = useContext(MyContext) as MainContext;

  const clearCookies = async () => {
    await api.get("/logout");
    history.push("/");
    location.reload();
  };

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
          <>
            <li>
              <Link className="link" to="/me">
                Me
              </Link>
            </li>
            <li>
              <span onClick={clearCookies} className="link">
                Logout
              </span>
            </li>
          </>
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
