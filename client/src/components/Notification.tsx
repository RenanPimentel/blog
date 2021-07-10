import React, { useContext, useEffect, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import { getTimeBetween } from "../util/getTimeBetween";

interface Props extends INotification {
  author?: IUser;
}

function Notification({ content, type, author, at_id, created_at, id }: Props) {
  const { defaultAvatar, notifications, setNotifications } =
    useContext(MainContext);
  const [toUrl, setToUrl] = useState("");

  const dismiss = async () => {
    await api.delete(`/notifications/${id}`);
    setNotifications(notifications.filter(ntf => ntf.id !== id));
  };

  useEffect(() => {
    setToUrl(`/${(type === "comment" || type === "post") && "posts"}/${at_id}`);
  }, [at_id, author?.id, content, type]);

  if (!author) {
    return <div>loading...</div>;
  }

  return (
    <div className="single-notification" title={getTimeBetween(created_at)}>
      <div className="same-line snt-line">
        <Link
          onClick={dismiss}
          to={`/users/${author.id}`}
          className="profile-picture"
          style={{ width: "40px", height: "40px" }}
        >
          <img
            src={author.avatar || defaultAvatar}
            alt={`${author.username} avatar`}
          />
        </Link>
        <Link onClick={dismiss} to={toUrl} className="no-dec">
          <header className="notification-header">
            <span>
              {author.username}{" "}
              {type === "comment"
                ? "commented"
                : type === "post"
                ? "posted"
                : null}
            </span>
          </header>
        </Link>
      </div>
      <div className="same-line right" style={{ alignItems: "center" }}>
        <div className="dismiss-not-btn" title="Dismiss" onClick={dismiss}>
          <button>
            <RiCloseFill />
          </button>
        </div>
        <Link
          title={content}
          className="content truncate no-dec"
          onClick={dismiss}
          to={toUrl}
        >
          {content}
        </Link>
      </div>
      <div className="line"></div>
    </div>
  );
}

export default Notification;
