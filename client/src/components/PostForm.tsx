import React from "react";
import Input from "./Input";
import Textarea from "./Textarea";

interface Props {
  handleSubmit(e: React.FormEvent<HTMLFormElement>): void;
  title: string;
  setTitle: CallableFunction;
  topic: string;
  setTopic: CallableFunction;
  content: string;
  setContent: CallableFunction;
  titleError: string;
  topicError: string;
  contentError: string;
}

function PostForm({
  handleSubmit,
  content,
  setContent,
  setTitle,
  setTopic,
  title,
  topic,
  titleError,
  topicError,
  contentError,
}: Props) {
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="form-control">
          <Input
            error={titleError}
            label="Title"
            onChange={e => setTitle(e.target.value)}
            value={title}
            type="text"
            id="title"
          />
        </div>
        <div className="form-control">
          <Input
            error={topicError}
            label="Topic"
            onChange={e => setTopic(e.target.value)}
            value={topic}
            type="text"
            id="title"
          />
        </div>
        <div className="form-control">
          <Textarea
            error={contentError}
            label="Content"
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
  );
}

export default PostForm;
