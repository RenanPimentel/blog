import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";

function NavUser() {
  const { logout, me, defaultAvatar } = useContext(MainContext);

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
              <span onClick={logout} className="link">
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
