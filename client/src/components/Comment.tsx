import React, { useContext, useEffect, useRef, useState } from "react";
import { RiCloseFill } from "react-icons/ri";
import { FaMinus, FaPlus } from "react-icons/fa";
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

function Comment({
  updated_at,
  created_at,
  author_id,
  post_author_id,
  content: propsContent,
  id,
  post_id,
  ...props
}: Props) {
  const context = useContext(MainContext);
  const [isAuthor, setIsAuthor] = useState(false);
  const [isPostAuthor, setIsPostAuthor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [content, setContent] = useState(propsContent);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [likes, setLikes] = useState(false);
  const [author, setAuthor] = useState({
    avatar: "",
    avatarAlt: "",
    username: "",
  });
  const contentPRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/users/${author_id}`);
      setAuthor({
        ...response.data.data.user,
        avatarAlt: `${response.data.data.user.username} avatar`,
      });
    })();
  }, [author_id]);

  useEffect(() => {
    setIsAuthor(context.me.id === author_id);
  }, [context.me.id, author_id]);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/posts/${post_id}`);
      setIsPostAuthor(response.data.data.post.author_id === context.me.id);
    })();
  }, [context.me.id, post_id]);

  useEffect(() => {
    if (!id) return;
    (async () => {
      const response = await api.get(`/comments/${id}/likes/count`);
      setLikeCount(Number(response.data.data.count));
    })();
  }, [id]);

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

  useEffect(() => {
    if (!id) return;
    (async () => {
      const response = await api.get(`/comments/${id}/like`);
      setLikes(response.data.data.likes);
    })();
  }, [id]);

  const sendEdited = async () => {
    props.changeComment(id, content, setContent);
  };

  const handleEditClick = async () => {
    if (editing) {
      await sendEdited();
      setEditing(false);
    } else {
      setEditing(true);
    }
  };

  const handleLikeClick = async () => {
    console.log("a");
    await api.put(`/comments/${id}/like`);
    if (likes) {
      setLikes(false);
      setLikeCount(likeCount - 1);
    } else {
      setLikes(true);
      setLikeCount(likeCount + 1);
    }
  };

  const handleRemoveClick = () => props.removeComment(id);

  const closeContent = async () => {
    setEditing(false);
    setContent(propsContent);
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
              to={author_id === context.me.id ? "/me" : `/users/${author_id}`}
            >
              <div className="profile-picture">
                <img src={author.avatar} alt={author.avatarAlt} />
              </div>
            </Link>
            <h3 className="username">{author.username}</h3>
          </div>
          <div className="same-line" style={{ gap: "2rem" }}>
            {new Date(created_at) < new Date(updated_at) && (
              <i
                title={`updated at ${new Date(updated_at).toLocaleString()}`}
                style={{ color: "gray" }}
              >
                updated
              </i>
            )}
            <BtnContainer
              showEdit={isAuthor}
              showRemove={isAuthor || isPostAuthor}
              handleEditClick={handleEditClick}
              handleRemoveClick={handleRemoveClick}
            />
          </div>
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
              {content}
            </p>
            <div className="same-line">
              <button className="link" title="like" onClick={handleLikeClick}>
                {likes ? <FaMinus /> : <FaPlus />}
              </button>
              {likeCount}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
