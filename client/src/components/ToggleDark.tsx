import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { BsSun, BsMoon } from "react-icons/bs";

function ToggleDark() {
  const [dark, setDark] = useState(localStorage.getItem("dark") === "true");

  useEffect(() => {
    localStorage.setItem("dark", String(dark));
    document.getElementById("root")?.classList[dark ? "add" : "remove"]("dark");
  }, [dark]);

  const toggleDark = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setDark(!dark);
  };

  return (
    <div className="toggle-dark" onClick={e => toggleDark(e)}>
      <button>{dark ? <BsSun /> : <BsMoon />}</button>
    </div>
  );
}

export default ToggleDark;
