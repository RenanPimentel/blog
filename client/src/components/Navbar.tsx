import React, { useContext, useEffect } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import Logo from "./Logo";
import NavUser from "./NavUser";
import Notifications from "./Notifications";
import SearchBar from "./SearchBar";

function Navbar() {
  const { me, getMe } = useContext(MainContext) as MainContext;

  useEffect(() => {
    getMe();
  }, [getMe]);

  return (
    <nav className="nav">
      <Link className="logo-container" to="/">
        <Logo />
      </Link>
      <div style={{ marginLeft: "1rem" }}>
        <Notifications />
      </div>
      <div
        className="container"
        style={{ display: "flex", justifyContent: "flex-start", maxWidth: "" }}
      >
        <SearchBar />
      </div>
      <ul className="links">
        {me?.id ? (
          <>
            <NavUser />
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
    </nav>
  );
}

export default Navbar;
