import React, { useEffect, useState } from "react";
import { api } from "../util/api";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";

interface Props {
  postId?: string;
  sendPost(post: { title: string; topic: string; content: string }): void;
}

interface ValuesObj {
  [key: string]: (line: string) => string;
}

function CreatePost(props: Props) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [topic, setTopic] = useState("");
  const [lines, setLines] = useState([""]);
  const [selects, setSelects] = useState(["p"]);

  useEffect(() => {
    (async () => {
      const response = await api.get<PostResponse>(`/posts/${props.postId}`);
      const { post } = response.data.data;
      setTitle(post.title || "");
      setLines([post.content?.trim() || ""]);
      setTopic(post.topic || "");
    })();
  }, [props.postId]);

  useEffect(() => {
    const selectValsObj: ValuesObj = {
      p: line => `\n${line}\n`,
      block: line => `\n\`\`\`${line}\n\`\`\`\n`,
      line: () => `\n---\n`,
      1: line => `\n# ${line}\n`,
      2: line => `\n## ${line}\n`,
      3: line => `\n### ${line}\n`,
      4: line => `\n#### ${line}\n`,
      5: line => `\n##### ${line}\n`,
      6: line => `\n###### ${line}\n`,
    };

    const newContent = lines
      .map((line, i) => {
        if (selects[i] in selectValsObj) {
          return selectValsObj[selects[i]](line);
        }
        throw new Error("select value not found");
      })
      .join("");
    setContent(newContent);
  }, [lines, selects, setContent]);

  return (
    <section>
      <article className="same-line wrap top" style={{ gap: "40px" }}>
        <PostForm
          topic={topic}
          title={title}
          values={lines}
          selects={selects}
          setTopic={setTopic}
          setTitle={setTitle}
          setValues={setLines}
          setSelects={setSelects}
        />
        <PostPreview title={title} content={content} topic={topic} />
      </article>
      <br />
      <div className="same-line" style={{ width: "100%" }}>
        <button
          className="btn btn-large"
          onClick={() => props.sendPost({ topic, content, title })}
        >
          Send
        </button>
      </div>
    </section>
  );
}

export default CreatePost;
