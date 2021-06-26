import React, { useEffect, useState } from "react";
import PostForm from "./PostForm";
import PostPreview from "./PostPreview";

interface Props {
  topic?: string;
  title?: string;
  content?: string;
  sendPost(post: { title: string; topic: string; content: string }): void;
}

interface ValuesObj {
  [key: string]: (line: string) => string;
}

function CreatePost(props: Props) {
  const [title, setTitle] = useState(props.title || "");
  const [content, setContent] = useState(props.content || "");
  const [topic, setTopic] = useState(props.topic || "");
  const [lines, setLines] = useState([""]);
  const [selects, setSelects] = useState(["p"]);

  useEffect(() => {
    setContent(props.content || "");
    setTitle(props.title || "");
    setTopic(props.topic || "");
    setSelects(["p"]);
    setLines(props.content ? [props.content] : [""]);
  }, [props]);

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
      <section className="same-line wrap top" style={{ gap: "30px" }}>
        <PostForm
          topic={topic}
          setTopic={setTopic}
          title={title}
          setTitle={setTitle}
          values={lines}
          setValues={setLines}
          selects={selects}
          setSelects={setSelects}
        />
        <PostPreview title={title} content={content} topic={topic} />
      </section>
      <br />
      <div className="same-line" style={{ width: "100%" }}>
        <button
          onClick={() => props.sendPost({ topic, content, title })}
          className="btn btn-large"
        >
          Send
        </button>
      </div>
    </section>
  );
}

export default CreatePost;
