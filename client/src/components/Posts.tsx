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
    <table className="posts-table">
      <thead>
        <tr>
          <th>Title</th>
          <th>Content</th>
          <th>Edit/Delete</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post.id}>
            <td className="overflow" title={post.title}>
              <p>{post.title}</p>
            </td>
            <td className="overflow" title={post.content}>
              <p>{post.content}</p>
            </td>
            <td className="edit-delete">
              <Link className="link" to={`/me/posts/update/${post.id}`}>
                <FaRegEdit />
              </Link>
              <button
                onClick={() => deletePost(post.id)}
                className="link"
                title={`delete #${post.id}`}
              >
                <FaRegTrashAlt />
              </button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default Posts;
