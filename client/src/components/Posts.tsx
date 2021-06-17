import React, { useContext } from "react";
import { FaRegTrashAlt, FaRegEdit } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

type Props = { posts: IPost[] };

function Posts({ posts }: Props) {
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
    <div className="posts-container">
      {posts.map(post => (
        <div className="card" key={post.id}>
          <div className="same-line">
            <h2
              className="title overflow"
              style={{ maxWidth: "14rem", width: "100%" }}
            >
              {post.title}
            </h2>
            <div className="btn-container">
              <Link className="link" to={`/me/posts/update/${post.id}`}>
                <FaRegEdit style={{ fill: "rgb(50, 200, 100)" }} />
              </Link>
              <button
                onClick={() => deletePost(post.id)}
                className="link"
                title={`delete #${post.id}`}
              >
                <FaRegTrashAlt style={{ fill: "rgb(200, 50, 50)" }} />
              </button>
            </div>
          </div>
          <div className="content-container">
            <p title={post.content}>{post.content}</p>
          </div>
          <div className="topic">{post.topic}</div>
        </div>
      ))}
    </div>
  );
}

export default Posts;
