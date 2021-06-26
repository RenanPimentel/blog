import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import PostForm from "../components/PostForm";
import PostPreview from "../components/PostPreview";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreate() {
  const { addMyPost } = useContext(MainContext);
  const history = useHistory();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [lines, setLines] = useState<string[]>([""]);
  const [selectValues, setSelectValues] = useState<string[]>(["###"]);
  const [topic, setTopic] = useState("");
  const [titleError, setTitleError] = useState("");
  const [topicError, setTopicError] = useState("");
  const [contentError, setContentError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/posts", {
        post: { title, content, topic },
      });
      addMyPost(response.data.data.post);
      history.push("/me/posts");
    } catch (err) {
      err.response.data.errors.forEach(
        (e: { reason: string; field?: string }) => {
          if (e.field === "title") {
            setTitleError(e.reason);
          } else if (e.field === "topic") {
            setTopicError(e.reason);
          } else if (e.field === "content") {
            setContentError(e.reason);
          } else {
            console.dir(e);
          }
        }
      );

      setTimeout(() => {
        setTitleError("");
        setTopicError("");
        setContentError("");
      }, 3000);
    }
  };

  const formProps = {
    handleSubmit,
    title,
    content,
    topic,
    setTitle,
    setContent,
    setTopic,
    titleError,
    topicError,
    contentError,
  };

  useEffect(() => {
    const newContent = lines
      .map((line, i) => [selectValues[i], line].join(" "))
      .join("\n");
    setContent(newContent);
  }, [lines, selectValues]);

  return (
    <main className="wrapper">
      <h2 className="fit-content">Create new post</h2>
      <section className="same-line wrap top" style={{ gap: "30px" }}>
        <PostForm
          topic={topic}
          setTopic={setTopic}
          title={title}
          setTitle={setTitle}
          values={lines}
          setValues={setLines}
          selects={selectValues}
          setSelects={setSelectValues}
        />
        <PostPreview {...formProps} />
      </section>
    </main>
  );
}

export default MePostsCreate;
