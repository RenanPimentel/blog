/* eslint-disable no-restricted-globals */
import React, { MutableRefObject, useRef, useState } from "react";
import { useContext } from "react";
import { useEffect } from "react";
import { useHistory } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";

type DataError = { field: string; reason: string };

function LoginPage() {
  const formEl: MutableRefObject<null | HTMLFormElement> = useRef(null);
  const { me } = useContext(MainContext) as MainContext;
  const history = useHistory();
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [loginError, setLoginError] = useState("");

  useEffect(() => {
    if (me?.id) {
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
        if (err.field === "login") {
          setLoginError(err.reason);
        } else if (err.field === "password") {
          setPasswordError(err.reason);
        }
      });

      setTimeout(() => {
        setLoginError("");
        setPasswordError("");
      }, 2500);
    }
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit} ref={formEl}>
          <Input
            label="Login"
            onChange={e => setLogin(e.target.value)}
            value={login}
            className="input"
            type="text"
            id="login"
            placeholder="AwesomeName"
            error={loginError}
          />
          <Input
            label="Password"
            onChange={e => setPassword(e.target.value)}
            value={password}
            className="input"
            type="password"
            id="password"
            placeholder="my safe password"
            error={passwordError}
          />
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
