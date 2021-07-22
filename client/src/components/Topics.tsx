import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { Link } from "react-router-dom";

interface Props {
  topics?: string[];
}

function Topics({ topics }: Props) {
  const [currTopics, setCurrTopics] = useState<string[]>([]);

  useEffect(() => {
    const topicsSet = new Set(topics?.filter(Boolean));
    setCurrTopics(Array.from(topicsSet));
  }, [topics]);

  return (
    <div className="topic-container">
      {currTopics.map((topic, i) => (
        <Link to={`/search?query=${topic}`} className="topic no-dec" key={i}>
          {topic}
        </Link>
      ))}
    </div>
  );
}

export default Topics;
