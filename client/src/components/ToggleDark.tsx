import React, { useContext, useEffect } from "react";
import { BsMoon, BsSun } from "react-icons/bs";
import { MainContext } from "../context/context";

function ToggleDark() {
  const { isDark, setIsDark } = useContext(MainContext);

  useEffect(() => {
    localStorage.setItem("dark", String(isDark));
    document.body?.classList[isDark ? "add" : "remove"]("dark");
  }, [isDark]);

  const toggleDark = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.preventDefault();
    setIsDark(!isDark);
  };

  return (
    <div className="toggle-dark" onClick={toggleDark}>
      <button>{isDark ? <BsSun /> : <BsMoon />}</button>
    </div>
  );
}

export default ToggleDark;
