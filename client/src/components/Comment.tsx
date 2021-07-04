import React, { useContext, useEffect, useRef, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { RiCloseFill } from "react-icons/ri";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import BtnContainer from "./BtnContainer";

interface Props extends IComment {
  removeComment(id: string): void;
  changeComment(id: string, content: string): void;
}

type Time = "year" | "month" | "day" | "week" | "hour" | "minute" | "second";

const getFormattedTime = (num: number, type: Time) => {
  if (num === 1) {
    return `a ${type} ago`;
  }

  if (type !== "second") {
    return `${num} ${type}s ago`;
  } else {
    return "now";
  }
};

const getTimeBetween = (dateStr: string) => {
  const now = new Date();
  const date = new Date(dateStr);

  const timeBetween = Number(now) - Number(date);

  const secs = Math.floor(timeBetween / 1000);
  const mins = Math.floor(timeBetween / (1000 * 60));
  const hours = Math.floor(timeBetween / (1000 * 60 * 60));
  const days = Math.floor(timeBetween / (1000 * 60 * 60 * 24));
  const weeks = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 7));
  const months = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 30));
  const years = Math.floor(timeBetween / (1000 * 60 * 60 * 24 * 30 * 365));

  return years
    ? getFormattedTime(years, "year")
    : months
    ? getFormattedTime(months, "month")
    : weeks
    ? getFormattedTime(weeks, "week")
    : days
    ? getFormattedTime(days, "day")
    : hours
    ? getFormattedTime(hours, "hour")
    : mins
    ? getFormattedTime(mins, "minute")
    : getFormattedTime(secs, "second");
};

function Comment({
  updated_at,
  created_at,
  author_id,
  post_author_id,
  content: defaultComment,
  id,
  post_id,
  changeComment,
  removeComment,
}: Props) {
  const { me, defaultAvatar } = useContext(MainContext);
  const [isCommentAuthor, setIsCommentAuthor] = useState(false);
  const [isPostAuthor, setIsPostAuthor] = useState(false);
  const [editing, setEditing] = useState(false);
  const [comment, setComment] = useState(defaultComment);
  const [error, setError] = useState("");
  const [likeCount, setLikeCount] = useState(0);
  const [likes, setLikes] = useState(false);
  const [author, setAuthor] = useState<IUser>({ avatar: "", username: "" });
  const contentPRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    if (!author_id || !post_id || !id || !post_author_id) return;
    setIsCommentAuthor(me.id === author_id);
    (async () => {
      const userPromise = api.get<UserResponse>(`/users/${author_id}`);
      const likeCountPromise = api.get<CountResponse>(
        `/comments/${id}/likes/count`
      );
      const likesPromise = api.get<LikesResponse>(`/comments/${id}/like`);

      const [userResponse, likeCountResponse, likesResponse] =
        await Promise.all([userPromise, likeCountPromise, likesPromise]);

      setLikes(likesResponse.data.data.likes);
      setAuthor(userResponse.data.data.user);
      setIsPostAuthor(post_author_id === me.id);
      setLikeCount(Number(likeCountResponse.data.data.count));
    })();
  }, [author_id, id, me.id, post_author_id, post_id]);

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
    if (likes) {
      setLikes(false);
      setLikeCount(likeCount - 1);
    } else {
      setLikes(true);
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
              <div className="profile-picture">
                <img
                  src={author.avatar || defaultAvatar}
                  alt={`${author.username} avatar`}
                />
              </div>
            </Link>
            <h3 className="username">{author.username}</h3>
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
                  {likes ? <FaHeart /> : <FaRegHeart />}
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
