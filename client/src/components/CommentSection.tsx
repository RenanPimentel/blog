import React, { useEffect, useState } from "react";
import { api } from "../util/api";
import Comment from "./Comment";
import SendComment from "./SendComment";

interface Props extends IPost {}

function CommentSection({ id }: Props) {
  const [comments, setComments] = useState<IComment[]>([]);
  const [post, setPost] = useState<IPost>({});

  useEffect(() => {
    (async () => {
      if (!id) return;
      const commentResponse = await api.get<CommentsResponse>(
        `/posts/${id}/comments`
      );
      const postResponse = await api.get<PostResponse>(`/posts/${id}`);

      setComments(commentResponse.data.data.comments);
      setPost(postResponse.data.data.post);
    })();
  }, [id]);

  const addComment = (comment: IComment) => {
    setComments([comment, ...comments]);
  };

  const removeComment = async (id: string) => {
    await api.delete(`/comments/${id}`);
    setComments(comments.filter(comment => comment.id !== id));
  };

  const changeComment = async (id: string, comment: string) => {
    await api.put(`/comments/${id}`, { comment });
    setComments(
      comments.map(cmt => {
        if (cmt.id === id) {
          return {
            ...cmt,
            content: comment,
            updated_at: new Date().toISOString(),
          };
        } else {
          return cmt;
        }
      })
    );
  };

  return (
    <section className="comments-container">
      <div className="rel">
        <div className="line-v"></div>
        <SendComment post={post} addComment={addComment} />
      </div>
      {comments?.length === 0 ? (
        <>
          <h3>No comments</h3>
        </>
      ) : (
        <>
          {comments.map(comment => (
            <Comment
              {...comment}
              key={comment.id}
              removeComment={removeComment}
              changeComment={changeComment}
            />
          ))}
        </>
      )}
    </section>
  );
}

export default CommentSection;
