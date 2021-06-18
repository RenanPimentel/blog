import React from "react";
import { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../util/api";

function SendComment() {
  const [comment, setComment] = useState("");
  const { post_id } = useParams<{ post_id: string }>();

  const sendComment = () => {
    (async () => {
      console.log(comment);
      const response = await api.post(`/posts/${post_id}/comments`, {
        comment,
      });
      console.log(response);
    })();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();

    sendComment();

    setComment("");
  };

  return (
    <form className="send-comment">
      <div className="form-control comment-div">
        <input
          type="text"
          className="input"
          value={comment}
          onChange={e => setComment(e.target.value)}
        />
        <button type="submit" className="btn large" onClick={handleClick}>
          Comment
        </button>
      </div>
    </form>
  );
}

export default SendComment;
