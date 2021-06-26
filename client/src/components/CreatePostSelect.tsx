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
      <option value="p">paragraph</option>
      <option value="block">block</option>
      <option value="line">line</option>
      <option value="1">1</option>
      <option value="2">2</option>
      <option value="3">3</option>
      <option value="4">4</option>
      <option value="5">5</option>
      <option value="6">6</option>
    </select>
  );
}

export default CreatePostSelect;
