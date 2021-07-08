import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Post from "../components/Post";
import { api } from "../util/api";
import NotFoundPage from "./NotFoundPage";

function PostPage() {
  const [post, setPost] = useState<IPost>({});
  const [comments, setComments] = useState<IComment[]>([]);
  const [error, setError] = useState(false);
  const { post_id } = useParams<{ post_id: string }>();
  const history = useHistory();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<PostResponse>(`/posts/${post_id}`);
        const commentsResponse = await api.get<CommentsResponse>(
          `/posts/${post_id}/comments`
        );
        setPost(response.data.data.post);
        setComments(commentsResponse.data.data.comments);
      } catch (err) {
        setError(true);
      }
    })();
  }, [post_id]);

  if (error) {
    return <NotFoundPage notFound="Post" />;
  }

  if (!post.id) {
    return (
      <main className="wrapper">
        <h2>loading...</h2>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <Post {...post} />
      <CommentSection
        comments={comments}
        post={post}
        setComments={setComments}
      />
    </main>
  );
}

export default PostPage;
