import React, { useContext } from "react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
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
      post: { title, content },
    });
    history.push("/me/posts");
  };

  return (
    <main className="wrapper">
      <h2>Create new post</h2>
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <div className="form-control">
            <label htmlFor="title">Title</label>
            <input
              onChange={e => setTitle(e.target.value)}
              value={title}
              type="text"
              id="title"
            />
          </div>
          <div className="form-control">
            <label htmlFor="topic">Topic</label>
            <input
              onChange={e => setTopic(e.target.value)}
              value={topic}
              type="text"
              id="title"
            />
          </div>
          <div className="form-control">
            <label htmlFor="content">Content</label>
            <textarea
              id="content"
              value={content}
              onChange={e => setContent(e.target.value)}
            />
          </div>
          <button type="submit" className="btn btn-large">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

export default MePostsCreate;
