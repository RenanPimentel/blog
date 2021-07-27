import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import { getTimeBetween } from "../util/getTimeBetween";
import BtnContainer from "./BtnContainer";
import Markdown from "./Markdown";
import Topics from "./Topics";

interface Props extends IPost {
  isOwner: boolean;
  showBy: boolean;
  author?: IUser;
}

function PostCard({
  author,
  content,
  id,
  title,
  topic,
  isOwner,
  showBy,
  created_at,
}: Props) {
  const { me, removeMyPost } = useContext(MainContext);
  const history = useHistory();

  const deletePost = async (id: string) => {
    try {
      await api.delete(`/posts/${id}`);
      removeMyPost(id);
    } catch (err) {
      console.dir(err);
    }
  };

  const redirectToUpdate = (id: string) => {
    history.push(`/me/posts/${id}/update`);
  };

  return (
    <article className="card">
      <div className="same-line right">
        <div style={{ minWidth: "0" }}>
          {showBy && (
            <div
              className="same-line"
              style={{
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
              }}
            >
              <span className="by no-dec">
                <Link
                  to={author?.id === me.id ? "/me" : `/users/${author?.id}`}
                >
                  By {author?.id === me.id ? "you" : author?.username}
                </Link>
                <Link
                  className="no-dec"
                  to={`/posts/${id}`}
                  title={new Date(created_at || "").toLocaleString()}
                >
                  {" "}
                  • {getTimeBetween(created_at || "")}
                </Link>
              </span>
            </div>
          )}
          <Link className="no-dec" to={`/posts/${id}`} style={{ width: "0" }}>
            <h2 className="title overflow" style={{ maxWidth: "100%" }}>
              {title}
            </h2>
          </Link>
        </div>
        {isOwner && (
          <BtnContainer
            showEdit={true}
            showRemove={true}
            handleEditClick={() => redirectToUpdate(id || "")}
            handleRemoveClick={() => deletePost(id || "")}
          />
        )}
      </div>
      <Link className="no-dec" to={`/posts/${id}`}>
        <div className="content-container">
          <Markdown content={content || ""} />
        </div>
      </Link>
      <Topics topics={topic?.split(" ")} />
    </article>
  );
}

export default PostCard;
