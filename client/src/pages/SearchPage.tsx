import React, { useEffect } from "react";
import { useContext } from "react";
import { useState } from "react";
import { useLocation } from "react-router-dom";
import PostCard from "../components/PostCard";
import UserCard from "../components/UserCard";
import { MainContext } from "../context/context";
import { api } from "../util/api";

const defaultElements: SearchResponse["data"] = { posts: [], users: [] };

function SearchPage() {
  const { me } = useContext(MainContext);
  const [elements, setElements] = useState(defaultElements);
  const locationSearch = useLocation().search;
  const query = new URLSearchParams(locationSearch).get("query");

  useEffect(() => {
    (async () => {
      const response = await api.get<SearchResponse>(`/search?query=${query}`);
      setElements(response.data.data);
    })();
  }, [query]);

  return (
    <main className="wrapper">
      <h1>
        Search: <i>'{query}'</i>
      </h1>
      <section>
        {elements.posts.length > 0 && <h2>Posts</h2>}
        <div className="posts-container">
          {elements.posts.map(post => (
            <PostCard
              {...post}
              author={{ username: post.username }}
              isOwner={post.author_id === me.id}
              showBy={true}
              key={post.id}
            />
          ))}
        </div>
      </section>
      <section>
        {elements.users.length > 0 && <h2>Users</h2>}
        <div className="posts-container">
          {elements.users.map(user => (
            <UserCard {...user} key={user.id} />
          ))}
        </div>
      </section>
    </main>
  );
}

export default SearchPage;
