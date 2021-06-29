import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import NotFoundPage from "./NotFoundPage";

function ResetpassPage() {
  const { setMe } = useContext(MainContext);
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [repeatedPasswordError, setRepeatedPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [found, setFound] = useState(false);
  const locationSearch = useLocation().search;

  const user_id = new URLSearchParams(locationSearch).get("user_id");
  const user_pass = new URLSearchParams(locationSearch).get("user_pass");

  useEffect(() => {
    api.get(`/users/${user_id}?user_pass=${user_pass}`).then(() => {
      setFound(true);
    });
  }, [user_id, user_pass]);

  if (!found) {
    return <NotFoundPage />;
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password !== repeatedPassword) {
      return setRepeatedPasswordError("different password");
    }

    try {
      const response = await api.post(
        "/account/password" +
          `?user_id=${encodeURI(String(user_id))}` +
          `&user_pass=${encodeURI(String(user_pass))}`,
        { password }
      );

      setMe(response.data.data.user);
      // eslint-disable-next-line no-restricted-globals
      location.assign("/me");
    } catch (err) {
      console.dir(err);
      setPasswordError(
        err.response?.data.errors.map((e: FieldError) => e.reason).join(", ")
      );
    }
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <Input
            value={password}
            onChange={e => setPassword(e.target.value)}
            error={passwordError}
            label="new password"
            type="password"
            id="password"
          ></Input>
          <Input
            value={repeatedPassword}
            onChange={e => setRepeatedPassword(e.target.value)}
            error={repeatedPasswordError}
            label="repeat new password"
            type="password"
            id="reapeted-password"
          ></Input>
          <button type="submit" className="btn btn-large">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetpassPage;
