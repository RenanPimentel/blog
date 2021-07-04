import React, { MutableRefObject, useContext, useRef, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function RegisterPage() {
  const { getMe } = useContext(MainContext);
  const formEl: MutableRefObject<null | HTMLFormElement> = useRef(null);
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!check) {
      return;
    }

    try {
      await api.post("/account/register", { username, email, password });
      history.push("/me");
      getMe();
    } catch (e) {}
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit} ref={formEl}>
          <div className="form-control">
            <label htmlFor="username">Username</label>
            <input
              onChange={e => setUsername(e.target.value)}
              value={username}
              className="input"
              type="text"
              id="username"
              placeholder="my_username"
            />
          </div>
          <div className="form-control">
            <label htmlFor="email">Email</label>
            <input
              onChange={e => setEmail(e.target.value)}
              value={email}
              className="input"
              type="email"
              id="email"
              placeholder="my_email@example.com"
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
            <div className="same-line right">
              <label htmlFor="cookies">
                Accept <Link to="/legal">legal</Link> terms:
              </label>
              <input
                type="checkbox"
                id="cookies"
                checked={check}
                onChange={e => setCheck(e.target.checked)}
              />
            </div>
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

export default RegisterPage;
