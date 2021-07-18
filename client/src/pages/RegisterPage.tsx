import React, { useContext, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function RegisterPage() {
  const { getMe, setTitle } = useContext(MainContext);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [check, setCheck] = useState(false);
  const [usernameError, setUsernameError] = useState("");

  useEffect(() => {
    setTitle("Register • Three Dots");
  }, [setTitle]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!check) return;

    if (username.includes(" ")) {
      setUsernameError("Your username can not contain space");
      return;
    }

    try {
      await api.post("/account/register", { username, email, password });
      await getMe();
      // eslint-disable-next-line no-restricted-globals
      location.assign("/me");
    } catch (e) {}
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <Input
            error={usernameError}
            errorTimeSpan={2500}
            maxChars={64}
            constraints={[!username.trim().includes(" ")]}
            value={username}
            setValue={setUsername}
            label="Username"
            inputDetails={{
              className: "input",
              type: "text",
              placeholder: "my_username",
              id: "username",
            }}
          />

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
                Accept <Link to="/terms">terms of service</Link>:
              </label>
              <div className="switch-box">
                <input
                  type="checkbox"
                  id="cookies"
                  checked={check}
                  onChange={e => setCheck(e.target.checked)}
                />
              </div>
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
