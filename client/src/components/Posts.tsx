import React from "react";
import { Link } from "react-router-dom";

type Props = { posts: IPost[] };

function Posts({ posts }: Props) {
  return (
    <ul>
      {posts.map(post => (
        <li key={post.id}>
          {post.title}
          <Link className="link" to={`/me/posts/update/${post.id}`}>
            Update post
          </Link>
        </li>
      ))}
    </ul>
  );
}

export default Posts;
