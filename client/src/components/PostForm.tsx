import React from "react";
import CreatePostSelect from "./CreatePostSelect";

interface Props {
  values: string[];
  setValues: CallableFunction;
  selects: string[];
  setSelects: CallableFunction;
  title: string;
  setTitle: CallableFunction;
  topic: string;
  setTopic: CallableFunction;
}

function PostForm({
  setValues,
  values,
  selects,
  setSelects,
  setTitle,
  title,
  setTopic,
  topic,
}: Props) {
  const addLine = () => {
    setValues([...values, ""]);
    setSelects([...selects, "p"]);
  };

  const removeLine = (i: number) => {
    setValues(values.filter((_, j) => j !== i));
    setSelects(selects.filter((_, j) => j !== i));
  };

  return (
    <section className="post-form-wrapper">
      <div className="same-line right top">
        <label htmlFor="title">Title</label>
        <textarea
          id="title"
          className="textarea"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />
      </div>
      <div className="same-line right top">
        <label htmlFor="topic">Topic</label>
        <textarea
          id="topic"
          className="textarea"
          value={topic}
          onChange={e => setTopic(e.target.value)}
        />
      </div>
      {values.map((value, i) => (
        <div className="same-line right top" key={i}>
          <CreatePostSelect selects={selects} setSelects={setSelects} i={i} />
          <textarea
            className="textarea"
            value={value}
            onChange={e =>
              setValues(
                values.map((val, j) => (j === i ? e.target.value : val))
              )
            }
          />
          <button className="btn large-btn" onClick={() => removeLine(i)}>
            -
          </button>
        </div>
      ))}
      <button className="btn large-btn" onClick={addLine}>
        +
      </button>
    </section>
  );
}

export default PostForm;
