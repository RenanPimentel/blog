import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import PostForm from "../components/PostForm";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [error, setError] = useState("");
  const [singlePost, setSinglePost] = useState<IPost>({});
  const { post_id } = useParams() as { post_id: string };
  const history = useHistory();

  useEffect(() => {
    api.get(`/posts/${post_id}`).then(res => setSinglePost(res.data.data.post));
  }, [post_id]);

  useEffect(() => {
    setTitle(singlePost.title || "");
    setContent(singlePost.content || "");
    setTopic(singlePost.topic || "");
  }, [singlePost]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.put(`/posts/${post_id}`, {
        title,
        content,
        topic,
      });
      history.push("/me/posts");
    } catch (err) {
      if (err.response.data?.errors) {
        setError(err.response.data.errors.join(", "));
        setTimeout(() => setError(""), 3000);
      }
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
    error,
    setError,
  };

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      {singlePost.id ? <PostForm {...formProps} /> : <h4>loading...</h4>}
    </main>
  );
}

export default MePostsUpdatePage;
