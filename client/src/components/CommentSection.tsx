import React, { useEffect, useState } from "react";
import { api } from "../util/api";
import SendComment from "./SendComment";

interface Props {
  post_id: string;
}

type Response = { data: { comments: IComment[] } };

function CommentSection({ post_id }: Props) {
  const [postComments, setPostComments] = useState<IComment[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get<Response>(`/posts/${post_id}/comments`);
      setPostComments(response.data.data.comments);
    })();
  }, [post_id]);

  return (
    <section className="comments-container">
      <div className="line-v"></div>
      <h1>Comments</h1>
      <SendComment />
      {postComments.length === 0 ? (
        <>
          <h3>No comments</h3>
        </>
      ) : (
        <>
          {postComments.map(
            ({ author_id, content, craeted_at, id, post_id, updated_at }) => (
              <div className="comment" key={id}>
                {content}
              </div>
            )
          )}
        </>
      )}
    </section>
  );
}

export default CommentSection;
