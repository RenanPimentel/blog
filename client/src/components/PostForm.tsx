import React from "react";

interface Props {
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  title: string;
  setTitle: CallableFunction;
  topic: string;
  setTopic: CallableFunction;
  content: string;
  setContent: CallableFunction;
  error: string;
}

function PostForm({
  handleSubmit,
  content,
  setContent,
  setTitle,
  setTopic,
  title,
  topic,
  error,
}: Props) {
  return (
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
      {error ? <p className="error">{error}</p> : <p></p>}
    </div>
  );
}

export default PostForm;
