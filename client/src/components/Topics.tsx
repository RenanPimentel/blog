import React from "react";
import { Link } from "react-router-dom";

interface Props {
  topics?: string[];
}

function Topics({ topics }: Props) {
  topics = topics?.filter(Boolean);
  return (
    <div className="topic-container">
      {Array.from(new Set(topics)).map((topic, i) => (
        <Link to={`/search?query=${topic}`} className="topic no-dec" key={i}>
          {topic}
        </Link>
      ))}
    </div>
  );
}

export default Topics;
