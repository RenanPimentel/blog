import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";

interface Props extends IUser {}

function PostCard({
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
      </div>
      <Link className="no-dec" to={`/users/${id}`}>
        <div className="avatar-container">
          <div className="card-avatar">
            <img src={avatar || defaultAvatar} alt={`${username} avatar`} />
          </div>
          <div className={`online ${online}`}></div>
        </div>
      </Link>
    </article>
  );
}

export default PostCard;
