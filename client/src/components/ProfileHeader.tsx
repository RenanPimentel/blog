import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";

interface Props extends IUser {}

function ProfileHeader({ banner, avatar, username, id }: Props) {
  const context = useContext(MainContext);

  return (
    <header>
      <div className="line-v"></div>
      <div className="profile">
        <div className="profile-banner">
          <img src={banner} alt={`${username} banner`} />
        </div>
        <div className="same-line right top">
          <Link
            to={id === context.me.id ? "/me" : `/users/${id}`}
            className="profile-picture"
          >
            <img src={avatar} alt={`${username} avatar`} />
          </Link>
          <h2 className="username">{username}</h2>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
