import React, { useEffect } from "react";
import { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import Logo from "./Logo";
import NavUser from "./NavUser";
import SearchBar from "./SearchBar";
import ToggleDark from "./ToggleDark";

function Navbar() {
  const { getMe, me } = useContext(MainContext) as MainContext;

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <nav className="nav">
      <Link className="logo-container" to="/">
        <Logo />
      </Link>
      <div
        className="container"
        style={{ display: "flex", justifyContent: "flex-start", maxWidth: "" }}
      >
        <SearchBar />
      </div>
      <ul className="links">
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
