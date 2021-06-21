import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../util/api";

interface Props {
  addComment(comment: IComment): void;
}

function SendComment({ addComment }: Props) {
  const [comment, setComment] = useState("");
  const { post_id } = useParams<{ post_id: string }>();

  const sendComment = () => {
    (async () => {
      const response = await api.post(`/posts/${post_id}/comments`, {
        comment,
      });
      addComment(response.data.data.comment);
    })();
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault();
    sendComment();
    setComment("");
  };

  return (
    <form className="send-comment">
      <div className="line-v"></div>
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
