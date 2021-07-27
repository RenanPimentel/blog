import React from "react";
import { useEffect } from "react";
import { useRef } from "react";
import { useState } from "react";

interface Props {
  setBlock: (block: IBlock) => void;
  block: IBlock;
  className?: string;
}

interface Option {
  value: OptionValue;
  selected: boolean;
}

const defaultOptions: OptionValue[] = [
  "h1",
  "h2",
  "normal",
  "h3",
  "h4",
  "h5",
  "h6",
  "block",
];

function EditSelect({ setBlock, block }: Props) {
  const select = useRef<HTMLSelectElement>(null);
  const [optionValue, setOptionValue] = useState<OptionValue>("normal");
  const [options] = useState<Option[]>(
    defaultOptions.map(str => ({ value: str, selected: false }))
  );

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setOptionValue(e.target.value as OptionValue);
  };

  const blur = () => {
    setBlock({ ...block, optionValue, editing: true, showOptions: false });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLSelectElement>) => {
    if (e.key === "Enter") blur();
  };

  useEffect(() => {
    if (!select.current) return;
    select.current.size = options.length;
    select.current
      .querySelectorAll("option")
      .forEach(opt => opt.selected && opt.focus());
  }, [options.length]);

  return (
    <select
      ref={select}
      autoFocus
      onBlur={blur}
      onKeyDown={handleKeyDown}
      className="edit-select"
      onChange={handleChange}
    >
      {options.map((option, i) =>
        option.selected ? (
          <option key={i} selected value={option.value} className="option">
            {option.value}
          </option>
        ) : (
          <option key={i} value={option.value} className="option">
            {option.value}
          </option>
        )
      )}
    </select>
  );
}

export default EditSelect;
