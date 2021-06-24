import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import PostFooter from "./PostFooter";
import ProfileHeader from "./ProfileHeader";

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

type Response = { data: { user: IUser } };

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
        const response = await api.get<Response>(`/users/${author_id}`);
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
        getViews={true}
        post_id={id || ""}
        banner={author.banner}
        avatar={author.avatar}
        username={author.username}
        id={author_id}
      />
      <h1>{title}</h1>
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
      <p>{content}</p>
      <p className="topic">{topic}</p>
      <PostFooter id={id} />
    </section>
  );
}

export default Post;
