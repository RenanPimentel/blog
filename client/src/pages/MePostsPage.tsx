import React, { useContext } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Posts from "../components/Posts";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsPage() {
  const { me, setMyPosts } = useContext(MainContext);

  useEffect(() => {
    (async () => {
      if (me.id && !me.posts?.length) {
        const response = await api.get(`/posts/by/${me.id}`);
        setMyPosts(response.data.data.posts);
      }
    })();
  }, [me.id, me.posts, setMyPosts]);

  if (!me.posts) {
    return <div>Loading...</div>;
  }

  if (!me.posts.length) {
    return <h2>No posts</h2>;
  }

  return (
    <main className="wrapper">
      <h2 className="fit-content">
        <Link className="link color" to="/me/posts/create">
          Create Post
        </Link>
      </h2>
      <h1>Your posts</h1>
      <Posts posts={me.posts} />
    </main>
  );
}

export default MePostsPage;
