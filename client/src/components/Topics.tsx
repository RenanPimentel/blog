import React from "react";

interface Props {
  topics?: string[];
}

function Topics({ topics }: Props) {
  topics = topics?.filter(Boolean);
  return (
    <div className="topic-container">
      {Array.from(new Set(topics)).map((topic, i) => (
        <span className="topic" key={i}>
          {topic}
        </span>
      ))}
    </div>
  );
}

export default Topics;
