import React, { useContext, useEffect, useRef, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import BtnContainer from "./BtnContainer";

interface Props extends IComment {
  removeComment(id: string): void;
  changeComment(
    id: string,
    content: string,
    setContent: CallableFunction
  ): void;
}

function Comment(props: Props) {
  const context = useContext(MainContext);
  const [author, setAuthor] = useState({
    avatar: "",
    avatarAlt: "",
    username: "",
  });
  const [isAuthor, setIsAuthor] = useState(false);
  const [isPostAuthor, setIsPostAuthor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(props.content);
  const [error, setError] = useState("");
  const contentPRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/users/${props.author_id}`);
      setAuthor({
        ...response.data.data.user,
        avatarAlt: `${response.data.data.user.username} avatar`,
      });
    })();
  }, [props.author_id]);

  useEffect(() => {
    setIsAuthor(context.me.id === props.author_id);
  }, [context.me.id, props.author_id]);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/posts/${props.post_id}`);
      setIsPostAuthor(response.data.data.post.author_id === context.me.id);
    })();
  }, [context.me.id, props.post_id]);

  useEffect(() => {
    if (256 < content.length) {
      setContent(content.slice(0, -1));
    } else {
      setError("");
    }

    if (255 < content.length) {
      setError("too long");
    }
  }, [content]);

  const sendEdited = async () => {
    props.changeComment(props.id, content, setContent);
  };

  const handleEditClick = async () => {
    if (editing) {
      await sendEdited();
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const handleRemoveClick = () => props.removeComment(props.id);

  const closeContent = async () => {
    setEditing(false);
    setContent(props.content);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await sendEdited();
    setEditing(false);
  };

  return (
    <div className="comment-container top">
      <div className="rel">
        <div className="line-v"></div>
        <div className="same-line right">
          <div className="same-line right no-dec">
            <Link
              to={
                props.author_id === context.me.id
                  ? "/me"
                  : `/users/${props.author_id}`
              }
            >
              <div className="profile-picture">
                <img src={author.avatar} alt={author.avatarAlt} />
              </div>
            </Link>
            <h3 className="username">{author.username}</h3>
          </div>
          <BtnContainer
            showEdit={isAuthor}
            showRemove={isAuthor || isPostAuthor}
            handleEditClick={handleEditClick}
            handleRemoveClick={handleRemoveClick}
          />
        </div>
        {editing ? (
          <form className="comment-content" onSubmit={handleSubmit}>
            <textarea
              autoFocus
              className="content"
              value={content}
              onChange={e => setContent(e.target.value.replace(/\s+/g, " "))}
              style={{
                border: error
                  ? "1px solid rgb(200, 50, 50)"
                  : "1px solid rgb(50, 200, 100)",
              }}
            />
            <button className="link close-btn" onClick={closeContent}>
              <RiCloseFill />
            </button>
            <button className="btn btn-large">Change</button>
          </form>
        ) : (
          <div className="comment-content">
            <p ref={contentPRef} className="content">
              {props.content}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
