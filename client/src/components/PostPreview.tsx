import React, { useContext } from "react";
import { useParams } from "react-router-dom";
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
  const { post_id } = useParams<{ post_id: string }>();

  return (
    <section className="post-preview">
      <div className="post-container">
        <ProfileHeader
          isAuthor={false}
          getViews={false}
          showFollow={false}
          post_id={post_id}
          banner={me.banner}
          avatar={me.avatar}
          username={me.username}
          id={me.id}
        />
        <h1>{title}</h1>
        <Markdown content={content} />
        <div className="same-line right">
          {topic.split(" ").map((topic, i) => (
            <p className="topic" key={i}>
              {topic}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}

export default PostPreview;
