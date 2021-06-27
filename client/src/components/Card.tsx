import React, { useContext } from "react";
import { Link, useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import BtnContainer from "./BtnContainer";
import Markdown from "./Markdown";

interface Props {
  id?: string;
  title?: string;
  content?: string;
  topic?: string;
  isOwner: boolean;
}

function Card({ content, id, title, topic, isOwner }: Props) {
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
    <article className="card no-dec">
      <div className="same-line">
        <Link className="no-dec" to={`/posts/${id}`} style={{ width: "0" }}>
          <h2 className="title overflow" style={{ maxWidth: "100%" }}>
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
        <div className="topic">{topic}</div>
      </Link>
    </article>
  );
}

export default Card;
