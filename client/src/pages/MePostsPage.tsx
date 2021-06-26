import React, { useContext } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Posts from "../components/Posts";
import { MainContext } from "../context/context";

function MePostsPage() {
  const context = useContext(MainContext);

  useEffect(() => {
    if (context.me.id) {
      if (!context.me.posts) {
        context.setMyPosts(context.me.id);
      }
    }
  }, [context]);

  if (!context.me.posts) {
    return <div>Loading...</div>;
  }

  return (
    <main className="wrapper">
      <h2 className="fit-content">
        <Link className="link color" to="/me/posts/create">
          Create Post
        </Link>
      </h2>
      <h1>Your posts</h1>
      <Posts posts={context.me.posts} />
    </main>
  );
}

export default MePostsPage;
