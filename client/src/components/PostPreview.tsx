import React, { useContext } from "react";
import { MainContext } from "../context/context";
import Markdown from "./Markdown";
import ProfileHeader from "./ProfileHeader";

interface Props {
  title: string;
  topic: string;
  content: string;
}

function PostPreview({ title, topic, content }: Props) {
  const { me } = useContext(MainContext);

  return (
    <section className="post-preview">
      <div className="post-container">
        <ProfileHeader
          getViews={false}
          showFollow={false}
          post_id={me.id || ""}
          banner={me.banner}
          avatar={me.avatar}
          username={me.username}
          id={me.id}
        />
        <h1>{title}</h1>
        <Markdown content={content} />
        {topic && <p className="topic">{topic}</p>}
      </div>
    </section>
  );
}

export default PostPreview;
