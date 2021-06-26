import React from "react";
import Card from "./Card";

type Props = { posts: IPost[] };

function Posts({ posts }: Props) {
  return (
    <div className="posts-container">
      {posts.length ? (
        posts.map(post => <Card {...post} isOwner={true} key={post.id} />)
      ) : (
        <h3>No posts</h3>
      )}
    </div>
  );
}

export default Posts;
