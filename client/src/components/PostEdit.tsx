import React, { useContext, useState } from "react";
import { useParams } from "react-router-dom";
import { MainContext } from "../context/context";
import { focus } from "../util/focus";
import uid from "../util/uid";
import EditableBlock from "./EditableBlock";
import EditableContent from "./EditableContent";
import ProfileHeader from "./ProfileHeader";

function PostEdit() {
  const { me } = useContext(MainContext);
  const { post_id } = useParams<{ post_id: string }>();
  const [title, setTitle] = useState("");
  const [prevKey, setPrevKey] = useState("");
  // const [markdown, setMarkdown] = useState("Content");
  const [blocks, setBlocks] = useState<IBlock[]>([
    {
      value: "Content",
      prevValue: "",
      id: uid(),
      tag: "p",
      showOptions: false,
    },
  ]);

  const addBlock = (block: IBlock) => {
    setBlocks([...blocks, block]);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter(block => block.id !== id));
  };

  const changeBlock = (id: string, block: IBlock) => {
    setBlocks(blocks.map(b => (b.id === id ? block : b)));
  };

  const setShowOptions = (id: string, show: boolean) => {
    setBlocks(blocks.map(b => ({ ...b, showOptions: id === b.id && show })));
  };

  const handleTitleChange = (e: React.FormEvent<Element>) => {
    setTitle((e.target as HTMLElement).innerHTML?.replace(/\s+/g, " ") || "");
  };

  const handleKeyDown = (e: React.KeyboardEvent<Element>, block: IBlock) => {
    const target = e.target as HTMLElement;
    const { innerHTML } = target;

    changeBlock(block.id, {
      ...block,
      value: innerHTML,
      prevValue: block.value,
      showOptions: prevKey === "/" && e.key === " ",
    });

    if (e.key === "Enter" && prevKey !== "Shift") {
      const newBlock = {
        id: uid(),
        prevValue: "",
        value: "",
        tag: "p",
        showOptions: false,
      } as IBlock;

      addBlock(newBlock);

      focus(
        newBlock.id,
        () => ((e.target as HTMLElement).innerHTML = innerHTML)
      );
    }

    if (e.key === "Backspace" && block.value === "") {
      const toFocusBlock = blocks[blocks.length - 2];

      if (blocks.length > 1) {
        focus(toFocusBlock.id);
        removeBlock(block.id);
      }
    }

    setPrevKey(e.key);
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
        <p>
          <span>To see available elements type</span>{" "}
          <span className="slash">/</span> +{" "}
          <span className="slash">BackSpace</span>
        </p>
        <EditableContent
          value={title}
          defaultValue="Title"
          tag="h1"
          className="title"
          onChange={handleTitleChange}
        />
        {blocks.map(block => (
          <EditableBlock
            value={block.value}
            id={block.id}
            tag={block.tag}
            showOptions={block.showOptions}
            setTag={tag => changeBlock(block.id, { ...block, tag })}
            setShowOptions={setShowOptions}
            defaultValue=""
            onKeyDown={e => handleKeyDown(e, block)}
            key={block.id}
          />
        ))}
      </div>
    </section>
  );
}

export default PostEdit;
