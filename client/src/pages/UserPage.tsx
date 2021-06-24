import React, { useContext, useEffect } from "react";
import { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Card from "../components/Card";
import ProfileHeader from "../components/ProfileHeader";
import { MainContext } from "../context/context";
import { api } from "../util/api";

interface Params {
  user_id: string;
}

function UserPage() {
  const context = useContext(MainContext);
  const [user, setUser] = useState<IUser>({});
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const history = useHistory();
  const { user_id } = useParams() as Params;

  if (user_id === context.me.id) {
    history.push("/me");
  }

  useEffect(() => {
    (async () => {
      const response = await api.get(`/users/${user_id}`);
      setUser(response.data.data.user);
    })();
  }, [user_id]);

  useEffect(() => {
    (async () => {
      const response = await api.get(`/posts/author/${user_id}`);
      setUserPosts(response.data.data.posts);
    })();
  }, [user_id]);

  return (
    <main className="wrapper">
      <div className="container">
        <div className="line-v"></div>
        <ProfileHeader
          showFollow={true}
          getViews={false}
          post_id=""
          avatar={user.avatar}
          banner={user.banner}
          username={user.username}
          id={user.id}
        />
      </div>
      <section className="user-posts">
        <div className="line-v"></div>
        <h2>User Posts</h2>
        <div className="posts-container">
          {userPosts.map(post => (
            <Card {...post} key={post.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default UserPage;
