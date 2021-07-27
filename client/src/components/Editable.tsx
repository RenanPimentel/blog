import React, { useRef, useState } from "react";
import EditSelect from "./EditSelect";
import Markdown from "./Markdown";

interface Props {
  block: IBlock;
  showEdit?: boolean;
  toContent: (block: IBlock) => string;
  setBlock: (block: IBlock) => void;
  createBlock?: (block: IBlock) => void;
  removeBlock?: () => void;
}

function Editable({
  toContent,
  setBlock,
  createBlock,
  removeBlock,
  block,
  showEdit,
}: Props) {
  const [height, setHeight] = useState(50);
  const textArea = useRef<HTMLTextAreaElement>(null);

  const changeEditing = (editing: boolean) => () => {
    setBlock({
      ...block,
      editing,
      value: textArea.current
        ? textArea.current.value.trim()
        : block.value.trim(),
    });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      changeEditing(false)();
      if (createBlock) {
        const newBlock = {
          editing: true,
          value: "",
          showOptions: false,
        } as IBlock;
        createBlock(newBlock);
      }
    }

    if (e.key === "Backspace" && textArea.current?.value === "") {
      if (removeBlock) removeBlock();
    }

    if (e.key === "/") {
      setBlock({ ...block, showOptions: true });
    }
  };

  const handleInput = () => {
    if (!textArea.current) return;
    textArea.current.style.height = "";
    textArea.current.style.height = `${textArea.current.scrollHeight}px`;
    setHeight(textArea.current.scrollHeight);
  };

  return (
    <div onClick={changeEditing(true)}>
      {block.showOptions && showEdit === true && (
        <EditSelect block={block} setBlock={setBlock} />
      )}
      {block.editing ? (
        <textarea
          autoFocus
          onBlur={changeEditing(false)}
          onKeyDown={handleKeyDown}
          onInput={handleInput}
          style={{ height: `${height}px` }}
          className="post-textarea"
          defaultValue={block.value}
          ref={textArea}
        />
      ) : (
        <Markdown content={toContent(block)} />
      )}
    </div>
  );
}

export default Editable;
