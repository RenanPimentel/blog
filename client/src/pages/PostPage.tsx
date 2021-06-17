import React, { useState } from "react";
import { useEffect } from "react";
import { useParams } from "react-router-dom";
import { api } from "../util/api";

function PostPage() {
  const [post, setPost] = useState<IPost>({});
  const { post_id } = useParams() as { post_id: string };

  const getDate = (strDate?: string) => {
    const date = new Date(strDate || "");
    return date.toLocaleString();
  };

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
      <div className="post-container">
        <div className="line-v"></div>
        <h1>{post.title}</h1>
        <div className="details">
          <span>
            {post.read_time} minute{post.read_time === 1 ? "" : "s"}
          </span>{" "}
          {new Date(post.updated_at || "") > new Date(post.created_at || "") ? (
            <span>updated at {getDate(post.updated_at)}</span>
          ) : (
            <span>created at {getDate(post.created_at)}</span>
          )}
        </div>
        <p>{post.content}</p>
      </div>
    </main>
  );
}

export default PostPage;
