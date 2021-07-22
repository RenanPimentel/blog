import React, { useContext } from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../context/context";
import Markdown from "./Markdown";
import ProfileHeader from "./ProfileHeader";
import Topics from "./Topics";

interface Props {
  title: string;
  topic: string;
  content: string;
}

function PostPreview({ title, topic, content }: Props) {
  const { me } = useContext(MainContext);
  const sectRef = useRef(null);
  const { post_id } = useParams<{ post_id: string }>();

  useEffect(() => {
    const sect = sectRef.current as unknown as HTMLDivElement;
    if (!sect) return;
    sect.contentEditable = "true";
  }, []);

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
        <section ref={sectRef}>
          <h1>{title}</h1>
          <Markdown content={content} />
          <Topics topics={topic.split(" ")} />
        </section>
      </div>
    </section>
  );
}

export default PostPreview;
