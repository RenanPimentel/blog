import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreatePage() {
  const context = useContext(MainContext);
  const history = useHistory();

  const sendPost = async (post: {
    title: string;
    topic: string;
    content: string;
  }) => {
    const response = await api.post("/posts", {
      post,
    });
    context.addMyPost(response.data.data.post);
    history.push(`/posts/${response.data.data.post.id}`);
  };

  return (
    <main className="wrapper">
      <h2 className="fit-content">Create new post</h2>
      <CreatePost sendPost={sendPost} />
    </main>
  );
}

export default MePostsCreatePage;
