import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
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
  view,
}: Props) {
  const { removeMyPost } = useContext(MainContext);
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
      <div className="same-line">
        <Link className="no-dec" to={`/posts/${id}`} style={{ width: "0" }}>
          {showBy && <i className="by">By {author?.username}</i>}
          <h2
            className="title overflow"
            style={{
              maxWidth: "100%",
              color: view ? "var(--main-color)" : "inherit",
            }}
          >
            {title}
          </h2>
        </Link>
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
        <Topics topics={topic?.split(" ")} />
      </Link>
    </article>
  );
}

export default PostCard;
