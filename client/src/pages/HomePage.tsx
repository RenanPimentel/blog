import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../util/api";

function HomePage() {
  const [posts, setPosts] = useState<IPost[]>([]);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.data.posts);
      } catch (err) {
        console.dir(err);
      }
    })();
  }, []);

  if (!posts.length) {
    return (
      <main className="wrapper">
        <h2>Loading...</h2>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <div className="posts-container">
        {posts.map(post => (
          <Link
            to={`posts/${post.id}`}
            className="link-no-underline"
            key={post.id}
          >
            <Card {...post} isOwner={false} />
          </Link>
        ))}
      </div>
    </main>
  );
}

export default HomePage;
