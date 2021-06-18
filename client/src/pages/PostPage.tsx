import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import CommentSection from "../components/CommentSection";
import Post from "../components/Post";
import { api } from "../util/api";

function PostPage() {
  const [post, setPost] = useState<IPost>({});
  const { post_id } = useParams() as { post_id: string };

  useEffect(() => {
    (async () => {
      const response = await api.get(`/posts/${post_id}`);
      setPost(response.data.data.post);
    })();
  }, [post_id]);

  if (!post) {
    return (
      <main className="wrapper">
        <h2>loading...</h2>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <Post {...post} />
      <CommentSection post_id={post_id} />
    </main>
  );
}

export default PostPage;
