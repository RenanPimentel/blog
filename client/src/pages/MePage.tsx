import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import PostCard from "../components/PostCard";
import UserCard from "../components/UserCard";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePage() {
  const { me, setTitle } = useContext(MainContext) as MainContext;
  const [posts, setPosts] = useState<IPost[]>([]);
  const [users, setUsers] = useState<IUser[]>([]);

  useEffect(() => {
    (async () => {
      const response = await api.get<PostsResponse & UsersResponse>(
        "/me/follows"
      );

      setPosts(response.data.data.posts);
      setUsers(response.data.data.users);
    })();
  }, []);

  useEffect(() => {
    setTitle("Me • Three Dots");
  }, [setTitle]);

  if (!me?.id) {
    return (
      <main className="wrapper">
        <h1>You are not logged in!</h1>
        <Link className="link" to="/login">
          Do you have an account? Login
        </Link>
        <br />
        <Link className="link" to="/register">
          Create your own account! Register
        </Link>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <br />
      <h2>Follows posts</h2>
      <section className="posts-container">
        {posts.map(post => (
          <PostCard
            author={users.find(user => user.id === post.author_id)}
            showBy={true}
            {...post}
            isOwner={false}
            key={post.id}
          />
        ))}
      </section>
      <br />
      <h2>Users you follow</h2>
      <section className="posts-container">
        {users.map(user => (
          <UserCard {...user} key={user.id} />
        ))}
      </section>
    </main>
  );
}

export default MePage;
