import React from "react";
import Card from "./Card";

type Props = { posts: IPost[] };

function Posts({ posts }: Props) {
  return (
    <div className="posts-container">
      {posts.map(post => (
        <Card {...post} isOwner={true} key={post.id} />
      ))}
    </div>
  );
}

export default Posts;
