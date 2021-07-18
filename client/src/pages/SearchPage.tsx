import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Posts from "../components/Posts";
import UserCard from "../components/UserCard";
import { api } from "../util/api";

const defaultElements: SearchResponse["data"] = { posts: [], users: [] };

function SearchPage() {
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
      <section>
        {elements.posts.length > 0 && (
          <>
            <h2>Posts</h2>
            <Posts posts={elements.posts} />
          </>
        )}
      </section>
      <section>
        {elements.users.length > 0 && (
          <>
            <h2>Users</h2>
            <div className="posts-container">
              {elements.users.map(user => (
                <UserCard {...user} key={user.id} />
              ))}
            </div>
          </>
        )}
      </section>
    </main>
  );
}

export default SearchPage;
