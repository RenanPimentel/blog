import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import Posts from "../components/Posts";
import ProfileHeader from "../components/ProfileHeader";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import NotFoundPage from "./NotFoundPage";

interface Params {
  user_id: string;
}

function UserPage() {
  const context = useContext(MainContext);
  const [error, setError] = useState(false);
  const [user, setUser] = useState<IUser>({});
  const [userPosts, setUserPosts] = useState<IPost[]>([]);
  const history = useHistory();
  const { user_id } = useParams() as Params;

  if (user_id === context.me.id) {
    history.push("/me");
  }

  useEffect(() => {
    (async () => {
      try {
        const userResponse = await api.get(`/users/${user_id}`);
        setUser(userResponse.data.data.user);
      } catch (err) {
        setError(true);
      }

      const postsResponse = await api.get<PostsResponse>(
        `/posts/by/${user_id}`
      );
      setUserPosts(postsResponse.data.data.posts);
    })();
  }, [user_id]);

  if (error) {
    return <NotFoundPage notFound="User" />;
  }

  return (
    <main className="wrapper">
      <div className="container">
        <div className="line-v"></div>
        <ProfileHeader
          isAuthor={false}
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
        {!userPosts.length ? (
          <h2>No Posts</h2>
        ) : (
          <>
            <h2>User Posts</h2>
            <Posts posts={userPosts} />
          </>
        )}
      </section>
    </main>
  );
}

export default UserPage;
