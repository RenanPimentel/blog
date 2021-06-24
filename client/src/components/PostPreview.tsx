import React, { useContext } from "react";
import ReactMarkdown from "react-markdown";
import {
  NormalComponents,
  SpecialComponents,
} from "react-markdown/src/ast-to-react";
import { Prism } from "react-syntax-highlighter";
import {
  materialLight,
  materialOceanic,
} from "react-syntax-highlighter/dist/esm/styles/prism";
import gfm from "remark-gfm";
import { MainContext } from "../context/context";
import ProfileHeader from "./ProfileHeader";

interface Props {
  title: string;
  topic: string;
  content: string;
}

function PostPreview({ title, topic, content }: Props) {
  const { isDark, me } = useContext(MainContext);

  const components: Partial<NormalComponents & SpecialComponents> = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <Prism
          style={isDark ? materialOceanic : materialLight}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className} {...props} />
      );
    },
  };

  /*
<section className="post-container">
      <ProfileHeader
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
*/

  return (
    <section className="post-preview">
      <div className="post-container">
        <ProfileHeader
          getViews={false}
          post_id={me.id || ""}
          banner={me.banner}
          avatar={me.avatar}
          username={me.username}
          id={me.id}
        />
        <h1>{title}</h1>
        <ReactMarkdown components={components} remarkPlugins={[gfm]}>
          {content}
        </ReactMarkdown>
        {topic && <p className="topic">{topic}</p>}
      </div>
    </section>
  );
}

export default PostPreview;
