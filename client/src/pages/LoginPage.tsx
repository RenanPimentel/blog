/* eslint-disable no-restricted-globals */
import React, { MutableRefObject, useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

type DataError = { field: string; reason: string };

function LoginPage() {
  const formEl: MutableRefObject<null | HTMLFormElement> = useRef(null);
  const { me } = useContext(MainContext) as MainContext;
  const history = useHistory();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");

  useEffect(() => {
    if (me) {
      history.push("/me");
    }
  }, [history, me]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await api.post("/login", { login, password });
      history.push("/me");
      location.reload();
    } catch (e) {
      const errors: DataError[] = e.response.data.errors;

      errors.forEach(err => {
        const input = formEl.current?.querySelector(
          `#${err.field}`
        ) as HTMLInputElement;

        const div = document.createElement("div");
        div.classList.add("error");
        div.textContent = err.reason;
        input.parentElement?.appendChild(div);
        input.classList.add("border-red");

        setTimeout(() => {
          input.parentElement?.removeChild(div);
          input.classList.remove("border-red");
        }, 2500);
      });
    }
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit} ref={formEl}>
          <div className="form-control">
            <label htmlFor="login">Login</label>
            <input
              onChange={e => setLogin(e.target.value)}
              value={login}
              className="input"
              type="text"
              id="login"
              placeholder="AwesomeName"
            />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input
              onChange={e => setPassword(e.target.value)}
              value={password}
              className="input"
              type="password"
              id="password"
              placeholder="my safe password"
            />
          </div>
          <div className="form-control">
            <button type="submit" className="btn btn-large">
              Submit
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
