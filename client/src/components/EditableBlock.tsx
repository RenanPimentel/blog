import React from "react";
import EditableContent from "./EditableContent";

interface Props extends HTMLElement {
  tag: string;
  value: string;
  defaultValue: string;
  showOptions: boolean;
  setTag: (tag: string) => void;
  onChange: (e: React.FormEvent<Element>) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
  setShowOptions: CallableFunction;
}

function EditableBlock({
  tag,
  value,
  id,
  className,
  defaultValue,
  onKeyDown,
  onChange,
  setTag,
  setShowOptions,
  showOptions,
}: Props) {
  const handleOptClick = (
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    e.preventDefault();
    const { tag } = (e.target as HTMLElement).dataset;
    if (!tag) return;

    setTag(tag);
    setShowOptions(false);
    document.getElementById(id)?.focus();
  };

  return (
    <div style={{ position: "relative" }}>
      {showOptions && (
        <section
          onBlur={e => e.relatedTarget || setShowOptions(false)}
          className="options-container"
        >
          <button
            onClick={handleOptClick}
            autoFocus={tag === "p"}
            data-tag="p"
            className="option"
          >
            normal
          </button>
          <button
            onClick={handleOptClick}
            data-tag="code"
            autoFocus={tag === "code"}
            className="option"
          >
            block
          </button>
          <button
            onClick={handleOptClick}
            autoFocus={tag === "h1"}
            data-tag="h1"
            className="option"
          >
            header
          </button>
          <button
            onClick={handleOptClick}
            autoFocus={tag === "h3"}
            data-tag="h3"
            className="option"
          >
            subheader
          </button>
        </section>
      )}
      <EditableContent
        tag={tag}
        value={value}
        id={id}
        className={className}
        defaultValue={defaultValue}
        onKeyDown={onKeyDown}
        onChange={onChange}
      />
    </div>
  );
}

EditableBlock.defaultProps = {
  tag: "p",
  value: "",
} as Props;

export default EditableBlock;
