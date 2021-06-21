import React, { useContext } from "react";
import { FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

interface Props {
  id?: string;
  title?: string;
  content?: string;
  topic?: string;
  isOwner?: boolean;
}

function Card({ content, id, title, topic, isOwner }: Props) {
  const { removeMyPost } = useContext(MainContext);

  const deletePost = async (id?: string) => {
    try {
      await api.delete(`/posts/${id}`);
      removeMyPost(id);
    } catch (err) {
      console.dir(err);
    }
  };

  return (
    <Link className="card no-dec" to={`/posts/${id}`}>
      <div className="same-line">
        <h2
          className="title overflow"
          style={{ maxWidth: "14rem", width: "100%" }}
        >
          {title}
        </h2>
        {isOwner && (
          <div className="btn-container">
            <Link className="link" to={`/me/posts/update/${id}`}>
              <FaRegEdit style={{ fill: "rgb(50, 200, 100)" }} />
            </Link>
            <button
              onClick={() => deletePost(id)}
              className="link"
              title={`delete #${id}`}
            >
              <FaRegTrashAlt style={{ fill: "rgb(200, 50, 50)" }} />
            </button>
          </div>
        )}
      </div>
      <div className="content-container">
        <p title={content}>{content}</p>
      </div>
      <div className="topic">{topic}</div>
    </Link>
  );
}

export default Card;
