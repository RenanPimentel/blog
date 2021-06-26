import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Post from "../components/Post";
import { api } from "../util/api";
import ErrorPage from "./ErrorPage";

function PostPage() {
  const [post, setPost] = useState<IPost>({});
  const [error, setError] = useState(false);
  const { post_id } = useParams<{ post_id: string }>();

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get(`/posts/${post_id}`);
        setPost(response.data.data.post);
      } catch (err) {
        console.dir(err);
        setError(true);
      }
    })();
  }, [post_id]);

  if (error) {
    return <ErrorPage notFound="Post" />;
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
      <CommentSection {...post} />
    </main>
  );
}

export default PostPage;
