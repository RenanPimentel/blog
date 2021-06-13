import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/context";

function NavUser() {
  const { logout, me, defaultAvatar } = useContext(MyContext);

  return (
    <div className="nav-user">
      <div className="profile-container">
        <Link to="/me" className="profile-picture">
          <img src={me.avatar || defaultAvatar} alt="your profile" />
        </Link>
        <div className="profile-settings">
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
  );
}

export default NavUser;
