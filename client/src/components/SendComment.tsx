import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

interface Props {
  addComment(comment: IComment): void;
  post: IPost;
}

function SendComment({ addComment, post }: Props) {
  const { me, socket } = useContext(MainContext);
  const [comment, setComment] = useState("");
  const [error, setError] = useState("");
  const { post_id } = useParams<{ post_id: string }>();

  useEffect(() => {
    if (256 < comment.length) {
      setComment(comment.slice(0, -1));
    } else {
      setError("");
    }

    if (255 < comment.length) {
      setError("too long");
    }
  }, [comment]);

  const sendComment = () => {
    (async () => {
      const response = await api.post(`/posts/${post_id}/comments`, {
        comment,
        post_author_id: post.author_id,
      });
      const data = {
        for: [post.author_id],
        data: { type: "comment", from: me.id, content: comment, at: post_id },
      } as { data: INotification; for: string[] };

      api.post("/notifications", data);
      socket.emit("notification", data);
      addComment(response.data.data.comment);
    })();
  };

  const handleClick = async (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    await sendComment();
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
          style={{
            border: `1px solid ${error ? "rgb(200, 50, 50)" : "transparent"}`,
          }}
        />
        <button type="submit" className="btn large" onClick={handleClick}>
          Comment
        </button>
      </div>
    </form>
  );
}

export default SendComment;
