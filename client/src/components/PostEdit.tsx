import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../context/context";
import Editable from "./Editable";
import ProfileHeader from "./ProfileHeader";

interface Props {
  sendPost: (post: IPost) => void;
  title: string;
  content: string;
  topic: string;
}

function PostEdit({ sendPost, title: propsTitle, content, topic }: Props) {
  const { me } = useContext(MainContext);
  const { post_id } = useParams<{ post_id: string }>();
  const [title, setTitle] = useState<IBlock>({
    editing: false,
    value: propsTitle,
    showOptions: false,
    optionValue: "h1",
  });
  const [blocks, setBlocks] = useState<IBlock[]>([
    {
      editing: false,
      value: content,
      showOptions: false,
      optionValue: "normal",
    },
  ]);
  const [topics, setTopics] = useState<IBlock[]>(
    topic.split(" ").map(value => ({
      editing: false,
      value,
      optionValue: "normal",
      showOptions: false,
    }))
  );

  const setSingleBlock = (i: number, newBlock: IBlock) => {
    setBlocks(blocks.map((block, j) => (i === j ? newBlock : block)));
  };

  const toContent = (block: IBlock) => {
    switch (block.optionValue) {
      case "normal":
        return block.value.trim();
      case "h1":
        return `# ${block.value.trim()}`;
      case "h2":
        return `## ${block.value.trim()}`;
      case "h3":
        return `### ${block.value.trim()}`;
      case "h4":
        return `#### ${block.value.trim()}`;
      case "h5":
        return `##### ${block.value.trim()}`;
      case "h6":
        return `###### ${block.value.trim()}`;
      case "block":
        return `\`\`\`js\n${block.value.trim()}\n\`\`\``;
      default:
        console.log("Error on switch at toContent");
        return block.value;
    }
  };

  const handlePostClick = () => {
    sendPost({
      content: blocks.map(block => toContent(block)).join("\n"),
      topic: topics.map(tpc => tpc.value).join(" "),
      title: title.value,
    });
  };

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
        <p style={{ marginBottom: "2rem" }}>
          To see available elements type <span className="slash">/</span>
        </p>
        <div className="title-container">
          <Editable
            toContent={toContent}
            block={title}
            showEdit={false}
            setBlock={setTitle}
          />
        </div>
        {blocks.map((block, i) => (
          <Editable
            block={block}
            setBlock={newBlock => setSingleBlock(i, newBlock)}
            createBlock={newBlock => {
              const newBlocks = [...blocks];
              newBlocks.splice(i, 0, newBlock);
              setBlocks([...blocks, newBlock]);
            }}
            showEdit={true}
            removeBlock={() => setBlocks(blocks.filter((_, j) => i !== j))}
            toContent={toContent}
            key={i}
          />
        ))}
        <div className="topic-container">
          {topics.map((topic, i) => (
            <div key={i} className="topic">
              <Editable
                block={topic}
                setBlock={newTopic =>
                  setTopics(topics.map((tpc, j) => (i === j ? newTopic : tpc)))
                }
                toContent={block => block.value}
                showEdit={false}
                createBlock={newTopic => {
                  const newTopics = [...topics];
                  newTopics.splice(i, 0, newTopic);
                  setTopics([...topics, newTopic]);
                }}
                removeBlock={() => setTopics(topics.filter((_, j) => i !== j))}
              />
            </div>
          ))}
        </div>
      </div>
      <div className="container left" style={{ marginTop: "2rem" }}>
        <button onClick={handlePostClick} className="btn large">
          Post
        </button>
      </div>
    </section>
  );
}

PostEdit.defaultProps = {
  title: "Title",
  content: "Content",
  topic: "Topic",
} as Props;

export default PostEdit;
