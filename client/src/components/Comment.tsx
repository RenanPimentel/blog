import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

interface Props extends IComment {}

function Comment(props: Props) {
  const context = useContext(MainContext);
  const [author, setAuthor] = useState({
    avatar: "",
    avatarAlt: "",
    username: "",
  });

  useEffect(() => {
    (async () => {
      const response = await api.get(`/users/${props.author_id}`);
      setAuthor({
        ...response.data.data.user,
        avatarAlt: `${response.data.data.user.username} avatar`,
      });
    })();
  }, [props.author_id]);

  return (
    <div className="comment-container top">
      <div className="rel">
        <div className="line-v"></div>
        <Link
          to={
            props.author_id === context.me.id
              ? "/me"
              : `/users/${props.author_id}`
          }
          className="same-line right rel no-dec"
          style={{ width: "fit-content" }}
        >
          <div className="profile-picture">
            <img src={author.avatar} alt={author.avatarAlt} />
          </div>
          <h3 className="username">{author.username}</h3>
        </Link>
        <div className="comment-content">
          <p className="content">{props.content}</p>
        </div>
      </div>
    </div>
  );
}

export default Comment;
