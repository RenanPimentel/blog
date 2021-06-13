import axios from "axios";
import React, { MutableRefObject, useRef, useState } from "react";
import { useCookies } from "react-cookie";
import { useHistory } from "react-router-dom";

type DataError = { field: string; reason: string };

function RegisterPage() {
  const formEl: MutableRefObject<null | HTMLFormElement> = useRef(null);
  const history = useHistory();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [cookies, setCookie] = useCookies(["cookie-name"]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const post = await axios.post("http://localhost:4000/register", {
        username,
        email,
        password,
      });
      history.push("/me");
      setCookie("me", post.data.user);
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
