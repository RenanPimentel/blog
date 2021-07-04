import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { FaEye } from "react-icons/fa";
import { MainContext } from "../context/context";
import FollowButton from "./FollowButton";

interface Props extends IUser {}

function UserCard({
  id,
  avatar,
  banner,
  email,
  last_login,
  username,
  online,
}: Props) {
  const { defaultAvatar } = useContext(MainContext);

  return (
    <article className="card">
      <div className="same-line">
        <Link className="no-dec" to={`/users/${id}`} style={{ width: "0" }}>
          <h2 className="title overflow" style={{ maxWidth: "100%" }}>
            {username}
          </h2>
        </Link>
        <FollowButton user_id={id} />
      </div>
      <Link className="no-dec" to={`/users/${id}`}>
        <div className="avatar-container">
          <div className="card-avatar">
            <img src={avatar || defaultAvatar} alt={`${username} avatar`} />
          </div>
          <div
            title={
              online
                ? `online since ${new Date(last_login || "").toLocaleString()}`
                : `last time on ${new Date(last_login || "").toLocaleString()}`
            }
            className={`online ${online}`}
          ></div>
        </div>
      </Link>
      {}
    </article>
  );
}

export default UserCard;
