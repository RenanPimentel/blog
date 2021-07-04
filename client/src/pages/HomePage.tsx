import React, { useEffect, useState } from "react";
import { useContext } from "react";
import Posts from "../components/Posts";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function HomePage() {
  const { me } = useContext(MainContext);
  const [posts, setPosts] = useState<IPost[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const response = await api.get<SearchResponse>("/posts?author=true");
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
      <Posts posts={posts} />
    </main>
  );
}

export default HomePage;
