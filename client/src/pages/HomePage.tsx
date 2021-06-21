import React, { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import Card from "../components/Card";
import { api } from "../util/api";

function HomePage() {
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get("/posts");
        setPosts(response.data.data.posts);
      } catch (err) {
        console.dir(err);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return (
      <main className="wrapper">
        <h2>Loading...</h2>
      </main>
    );
  }

  if (!posts.length) {
    return (
      <main className="wrapper">
        <h2>Couldn't find any posts... Are you logged in?</h2>
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
