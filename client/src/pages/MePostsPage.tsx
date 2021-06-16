import React, { useContext } from "react";
import { useEffect } from "react";
import { Link } from "react-router-dom";
import Posts from "../components/Posts";
import { MainContext } from "../context/context";

function MePostsPage() {
  const context = useContext(MainContext);

  useEffect(() => {
    if (context.me.id) {
      if (!context.me.myPosts) {
        context.setMyPosts(context.me.id);
      }
    }
  }, [context]);

  if (!context.me.myPosts) {
    return <div>Loading...</div>;
  }

  return (
    <main className="wrapper">
      <Link className="link large color" to="/me/posts/create">
        Upload Post
      </Link>
      <h1>Your posts</h1>
      <Posts posts={context.me.myPosts} />
    </main>
  );
}

export default MePostsPage;
