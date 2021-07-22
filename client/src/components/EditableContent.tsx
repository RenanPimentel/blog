import { createElement } from "react";

interface Props extends HTMLElement {
  tag: string;
  value: string;
  defaultValue: string;
  showCommands: boolean;
  onChange: (e: React.FormEvent<Element>) => void;
  onKeyDown: (e: React.KeyboardEvent<Element>) => void;
}

function EditableContent({
  tag,
  value,
  id,
  className,
  defaultValue,
  onKeyDown,
  onChange,
}: Props) {
  const element = createElement(tag, {
    onInput: onChange,
    onKeyDown,
    value,
    className,
    dangerouslySetInnerHTML: { __html: defaultValue },
    contentEditable: true,
    id,
  });

  return element;
}

EditableContent.defaultProps = {
  tag: "p",
  value: "",
} as Props;

export default EditableContent;
