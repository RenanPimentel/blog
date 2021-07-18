import React, { useContext, useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import NotFoundPage from "./NotFoundPage";

function ResetpassPage() {
  const { setMe, setTitle } = useContext(MainContext);
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

  useEffect(() => {
    setTitle("Resset Password • Three Dots");
  }, [setTitle]);

  if (!found) {
    return <NotFoundPage />;
  }

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <Input
            inputDetails={{
              type: "password",
            }}
            value={password}
            setValue={setPassword}
            error={passwordError}
            label="new password"
          />
          <Input
            inputDetails={{
              type: "password",
            }}
            value={repeatedPassword}
            setValue={setRepeatedPassword}
            error={repeatedPasswordError}
            label="repeat new password"
          />
          <button type="submit" className="btn btn-large">
            Send
          </button>
        </form>
      </div>
    </main>
  );
}

export default ResetpassPage;
