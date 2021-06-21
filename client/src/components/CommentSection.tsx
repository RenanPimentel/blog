import React, { useCallback, useEffect, useState } from "react";
import { api } from "../util/api";
import Comment from "./Comment";
import SendComment from "./SendComment";

interface Props extends IPost {}

type Response = { data: { comments: IComment[] } };

function CommentSection({ id }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);

  const cb = useCallback(async () => {
    if (id) {
      const response = await api.get<Response>(`/posts/${id}/comments`);
      setComments(response.data.data.comments);
    }
  }, [id]);

  useEffect(() => {
    cb();
  }, [cb]);

  const addComment = (comment: IComment) => {
    setComments([...comments, comment]);
  };

  return (
    <section className="comments-container">
      <div className="rel">
        <div className="line-v"></div>
        <SendComment addComment={addComment} />
      </div>
      {comments?.length === 0 ? (
        <>
          <h3>No comments</h3>
        </>
      ) : (
        <>
          {comments.map(comment => (
            <Comment {...comment} key={comment.id} />
          ))}
        </>
      )}
    </section>
  );
}

export default CommentSection;
