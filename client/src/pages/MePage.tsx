import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePage() {
  const { me } = useContext(MainContext) as MainContext;
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get<PostsResponse>("/me/follows");
      setPosts(response.data.data.posts);
    })();
  }, []);

  if (!me?.id) {
    return (
      <main className="wrapper">
        <h1>You are not logged in!</h1>
        <Link className="link" to="/login">
          Do you have an account? Login
        </Link>
        <br />
        <Link className="link" to="/register">
          Create your own account! Register
        </Link>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <div className="posts-container">
        {posts.map(post => (
          <PostCard {...post} isOwner={false} key={post.id} />
        ))}
      </div>
    </main>
  );
}

export default MePage;
