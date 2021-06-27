import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function NavUser() {
  const { me, defaultAvatar } = useContext(MainContext);

  const logout = async () => {
    await api.get("/account/logout");
    // eslint-disable-next-line no-restricted-globals
    location.assign("/me");
  };

  return (
    <div className="nav-user">
      <div className="profile-container">
        <div className="profile-picture">
          <img src={me.avatar || defaultAvatar} alt="your profile" />
        </div>
        <div className="container-wrapper">
          <div className="profile-settings">
            <li>
              <Link to="/me" className="link">
                Me
              </Link>
              <div className="line"></div>
            </li>
            <li>
              <Link to="/me/posts" className="link">
                My posts
              </Link>
              <div className="line"></div>
            </li>
            <li>
              <Link to="/settings" className="link">
                Settings
              </Link>
              <div className="line"></div>
            </li>
            <li>
              <span className="link" onClick={logout}>
                Logout
              </span>
              <div className="line"></div>
            </li>
          </div>
        </div>
      </div>
    </div>
  );
}

export default NavUser;
