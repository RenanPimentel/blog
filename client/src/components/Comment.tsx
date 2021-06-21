import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { api } from "../util/api";

interface Props extends IComment {}

function Comment(props: Props) {
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
    <div className="comment-container">
      <header className="same-line right">
        <div className="profile-picture">
          <img src={author.avatar} alt={author.avatarAlt} />
        </div>
        <div className="alt-right">
          <h3 className="username">{author.username}</h3>
          <p className="content">{props.content}</p>
        </div>
      </header>
    </div>
  );
}

export default Comment;
