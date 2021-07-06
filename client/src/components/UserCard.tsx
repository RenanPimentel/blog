import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { FaUserPlus, FaUserSlash } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

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
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!id) return;
      const response = await api.get(`/users/${id}/followers/count`);
      setIsFollowing(response.data.data.follows);
    })();
  }, [id]);

  const handleClick = async () => {
    await api.post(`/users/${id}/follow`);
    if (isFollowing) {
      setIsFollowing(false);
    } else {
      setIsFollowing(true);
    }
  };

  return (
    <article className="card">
      <div className="same-line">
        <Link className="no-dec" to={`/users/${id}`} style={{ width: "0" }}>
          <h2 className="title overflow" style={{ maxWidth: "100%" }}>
            {username}
          </h2>
        </Link>
        <div className="follow-container">
          <button title="follow" onClick={handleClick} className="link">
            {isFollowing ? <FaUserSlash /> : <FaUserPlus />}
          </button>
        </div>
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
