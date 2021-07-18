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
      <div className="same-line right" style={{ gap: "2rem", width: "100px" }}>
        <Link className="logo-container" to="/">
          <Logo />
        </Link>
      </div>
      <SearchBar />
      {me?.id ? (
        <div className="same-line left" style={{ gap: "2rem", width: "100px" }}>
          <Notifications />
          <NavUser />
        </div>
      ) : (
        <ul className="links">
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
        </ul>
      )}
    </nav>
  );
}

export default Navbar;
