import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Card from "../components/Card";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function HomePage() {
  const { me } = useContext(MainContext);
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

  if (!me.id) {
    return (
      <main className="wrapper">
        <h2>You are not logged in</h2>
      </main>
    );
  }

  if (!posts.length) {
    return (
      <main className="wrapper">
        <h2>No posts</h2>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <div className="posts-container">
        {posts.map(post => (
          <Card
            content={post.content || ""}
            id={post.id || ""}
            title={post.title || ""}
            topic={post.topic || ""}
            isOwner={false}
            key={post.id}
          />
        ))}
      </div>
    </main>
  );
}

export default HomePage;
