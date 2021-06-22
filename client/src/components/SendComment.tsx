import React, { useState } from "react";
import { useContext } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import Input from "./Input";

interface Props {
  addComment(comment: IComment): void;
}

function SendComment({ addComment }: Props) {
  const context = useContext(MainContext);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { post_id } = useParams<{ post_id: string }>();

  const sendComment = () => {
    (async () => {
      try {
        const response = await api.post(`/posts/${post_id}/comments`, {
          comment,
          post_author_id: context.me.id,
        });
        addComment(response.data.data.comment);
      } catch (err) {
        console.dir(err);
        setError(
          err.response.data.errors.map((e: FieldError) => e.reason).join(", ")
        );
      }
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
        <Input
          error={error}
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
