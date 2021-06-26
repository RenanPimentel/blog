import React from "react";

interface Props {
  selects: string[];
  setSelects: CallableFunction;
  i: number;
}

function CreatePostSelect({ selects, setSelects, i }: Props) {
  return (
    <select
      className="select"
      value={selects[i]}
      onChange={e =>
        setSelects(selects.map((sel, j) => (i === j ? e.target.value : sel)))
      }
    >
      <option value="###">normal</option>
      <option value="#">1</option>
      <option value="##">2</option>
      <option value="####">3</option>
      <option value="#####">4</option>
      <option value="######">5</option>
      <option value="---">line</option>
      <option value=">">inline block</option>
      <option value="```txt\n$text_\n```">block</option>
      <option value="[$title_]($link_)">link</option>
      <option value="[$name_]($url_)">image</option>
      <option value="```js\n$text_\n```">js</option>
      <option value="```json\n$text_\n```">json</option>
      <option value="```py\n$text_\n```">python</option>
    </select>
  );
}

export default CreatePostSelect;
