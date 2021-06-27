import React, { useContext, useState } from "react";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import NotFoundPage from "./NotFoundPage";

interface Obj {
  [key: string]: string;
}

function ResetpassPage() {
  const { setMe } = useContext(MainContext);
  const [password, setPassword] = useState("");
  const [repeatedPassword, setRepeatedPassword] = useState("");
  const [repeatedPasswordError, setRepeatedPasswordError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [found, setFound] = useState(false);
  const reactLocation = useLocation();

  const arr = reactLocation.search.split(/\?|&/g).filter(Boolean);
  const query: Obj = {};

  for (const str of arr) {
    const [key, ...value] = str.split("=");
    query[key] = value.join("=");
  }

  useEffect(() => {
    api.get(`/users/${query.user_id}?user_pass=${query.user_pass}`).then(() => {
      setFound(true);
    });
  }, [query.user_id, query.user_pass]);

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
          `?user_id=${encodeURI(query.user_id)}` +
          `&user_pass=${encodeURI(query.user_pass)}`,
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
