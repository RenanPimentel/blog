import React, { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import PostForm from "../components/PostForm";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreate() {
  const { me, addMyPost } = useContext(MainContext);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const response = await api.post("/posts", {
      user_id: me.id,
      user_password: me.password,
      post: { title, content, topic },
    });

    addMyPost(response.data.data.post);
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
