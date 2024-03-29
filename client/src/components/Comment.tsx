import React, { useContext, useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import { getTimeBetween } from "../util/getTimeBetween";
import BtnContainer from "./BtnContainer";

interface Props extends IComment {
  removeComment(id: string): void;
  changeComment(id: string, content: string): void;
}

function Comment({
  updated_at,
  created_at,
  author_id,
  post_author_id,
  content: defaultComment,
  id,
  post_id,
  like_count,
  likes,
  avatar,
  username,
  changeComment,
  removeComment,
}: Props) {
  const { me, defaultAvatar } = useContext(MainContext);
  const [isCommentAuthor, setIsCommentAuthor] = useState(false);
  const [isPostAuthor, setIsPostAuthor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(defaultComment);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(Number(like_count));
  const [userLikes, setUserLikes] = useState(likes);
  const contentPRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!author_id || !post_id || !id || !post_author_id) return;
    setIsCommentAuthor(me.id === author_id);
    setIsPostAuthor(post_author_id === me.id);
  }, [author_id, avatar, id, me.id, post_author_id, post_id, username]);

  useEffect(() => {
    if (256 < comment.length) {
      setComment(comment.slice(0, -1));
    } else {
      setError("");
    }

    if (255 < comment.length) {
      setError("too long");
    }
  }, [comment]);

  const sendEdited = async () => {
    if (comment !== defaultComment) {
      changeComment(id, comment);
    }
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
    await api.put(`/comments/${id}/like`);
    if (userLikes) {
      setUserLikes(false);
      setLikeCount(likeCount - 1);
    } else {
      setUserLikes(true);
      setLikeCount(likeCount + 1);
    }
  };

  const closeContent = async () => {
    setEditing(false);
    setComment(defaultComment);
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
        <div className="same-line flex-spaced">
          <div className="same-line right" style={{ alignItems: "center" }}>
            <Link to={author_id === me.id ? "/me" : `/users/${author_id}`}>
              <div className="profile-picture no-dec">
                <img src={avatar || defaultAvatar} alt={`${username} avatar`} />
              </div>
            </Link>
            <h3 className="username">{username}</h3>
          </div>
          <div className="same-line" style={{ gap: "1rem" }}>
            {new Date(created_at) < new Date(updated_at) && (
              <i
                title={`updated at ${new Date(updated_at).toLocaleString()}`}
                style={{ color: "gray", marginRight: "1rem" }}
              >
                updated
              </i>
            )}
            <BtnContainer
              showEdit={isCommentAuthor}
              showRemove={isCommentAuthor || isPostAuthor}
              handleEditClick={handleEditClick}
              handleRemoveClick={() => removeComment(id)}
            />
          </div>
        </div>
        {editing ? (
          <form className="comment-content" onSubmit={handleSubmit}>
            <textarea
              autoFocus
              className="comment"
              value={comment}
              onChange={e => setComment(e.target.value.replace(/\s+/g, " "))}
              style={{
                border: error
                  ? "1px solid rgb(200, 50, 50)"
                  : "1px solid rgb(50, 200, 100)",
                height: contentPRef.current?.clientHeight,
              }}
            />
            <button className="link close-btn" onClick={closeContent}>
              <RiCloseFill />
            </button>
            <button className="btn btn-large">Change</button>
          </form>
        ) : (
          <div className="comment-content">
            <div className="comment">
              <p ref={contentPRef}>{comment}</p>
              <div></div> {/* for like-comment always be on the right */}
              <div
                className="like-comment"
                title={"created at " + new Date(created_at).toLocaleString()}
              >
                <i style={{ color: "gray", marginRight: "2rem" }}>
                  {getTimeBetween(created_at)}
                </i>
                <button
                  className="link red-svg"
                  title="Like"
                  onClick={handleLikeClick}
                >
                  {userLikes ? <FaHeart /> : <FaRegHeart />}
                </button>
                <p>{likeCount}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Comment;
