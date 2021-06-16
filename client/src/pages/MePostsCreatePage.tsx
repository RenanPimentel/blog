import React, { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import PostForm from "../components/PostForm";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreate() {
  const context = useContext(MainContext);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    api.post("/posts", {
      user_id: context.me.id,
      user_password: context.me.password,
      post: { title, content, topic },
    });
    history.push("/me/posts");
  };

  const formProps = {
    handleSubmit,
    title,
    content,
    topic,
    setTitle,
    setContent,
    setTopic,
    error: "",
  };

  return (
    <main className="wrapper">
      <h2>Create new post</h2>
      <PostForm {...formProps} />
    </main>
  );
}

export default MePostsCreate;
