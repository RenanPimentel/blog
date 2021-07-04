import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import Markdown from "./Markdown";
import PostLikeContainer from "./PostLikeContainer";
import ProfileHeader from "./ProfileHeader";
import Topics from "./Topics";

interface Props {
  title?: string;
  read_time?: number;
  created_at?: string;
  updated_at?: string;
  content?: string;
  author_id?: string;
  id?: string;
  topic?: string;
}

function Post({
  content,
  created_at,
  read_time,
  title,
  updated_at,
  author_id,
  id,
  topic,
}: Props) {
  const context = useContext(MainContext);
  const [author, setAuthor] = useState({
    avatar: "",
    username: "",
    banner: "",
  });

  const getDate = (strDate?: string) => {
    const date = new Date(strDate || "");
    return date.toLocaleString();
  };

  useEffect(() => {
    (async () => {
      if (author_id !== undefined) {
        const response = await api.get<UserResponse>(`/users/${author_id}`);
        const { avatar, username, banner } = response.data.data.user;
        setAuthor({
          avatar: avatar || context.defaultAvatar,
          username: username || "",
          banner: banner || context.defaultBanner,
        });
      }
    })();
  }, [author_id, context.defaultAvatar, context.defaultBanner]);

  return (
    <section className="post-container">
      <ProfileHeader
        isAuthor={context.me.id === author_id}
        getViews={true}
        showFollow={false}
        post_id={id || ""}
        banner={author.banner}
        avatar={author.avatar}
        username={author.username}
        id={author_id}
      />
      <div className="details">
        <span>
          {read_time} minute{read_time && read_time <= 1 ? "" : "s"} read
        </span>
        {new Date(updated_at || "") > new Date(created_at || "") ? (
          <div>
            <span>created at {getDate(created_at)}</span>{" "}
            <span>updated at {getDate(updated_at)}</span>
          </div>
        ) : (
          <span>created at {getDate(updated_at)}</span>
        )}
      </div>
      <h1>{title}</h1>
      <Markdown content={content || ""} />
      <Topics topics={topic?.split(" ")} />
      <PostLikeContainer id={id} />
    </section>
  );
}

export default Post;
