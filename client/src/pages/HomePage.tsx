import React, { useEffect, useState } from "react";
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
          <Card {...post} isOwner={false} key={post.id} />
        ))}
      </div>
    </main>
  );
}

export default HomePage;
