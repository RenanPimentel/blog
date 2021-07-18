import React from "react";
import { useContext } from "react";
import { MainContext } from "../context/context";
import PostCard from "./PostCard";

type Props = { posts: (IPost & IUser)[] };

function Posts({ posts }: Props) {
  const { me } = useContext(MainContext);

  return (
    <section className="posts-container">
      {posts.length ? (
        posts.map(post => (
          <PostCard
            author={{
              id: post.author_id,
              avatar: post.avatar,
              username: post.username,
              online: post.online,
              last_login: post.last_login,
            }}
            showBy={true}
            content={post.content}
            id={post.id}
            title={post.title}
            topic={post.topic}
            isOwner={post.author_id === me.id || !post.author_id}
            created_at={post.created_at}
            updated_at={post.updated_at}
            key={post.id}
          />
        ))
      ) : (
        <h3>No posts</h3>
      )}
    </section>
  );
}

export default Posts;
