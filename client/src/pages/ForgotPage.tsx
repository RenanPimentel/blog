import React, { useContext, useEffect, useState } from "react";
import Loader from "react-loader-spinner";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function ForgotPage() {
  const { setTitle } = useContext(MainContext);
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [details, setDetails] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await api.post("/account/forgot", { email });
      setEmail("");
      setDetails(
        `An email was sent to you by '${response.data.data.emailRes.name}' with a button to change '${response.data.data.username}' password.`
      );
    } catch (err) {
      console.dir(err);
      setEmailError(
        err.response.data.errors.map((e: FieldError) => e.reason).join(", ")
      );

      setTimeout(() => {
        setEmailError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setTitle("Three Dots");
  }, [setTitle]);

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <Input
            inputDetails={{
              onChange: e => setEmail(e.target.value),
              className: "input",
              type: "email",
              placeholder: "me@example.com",
            }}
            label="Your email"
            value={email}
            setValue={setEmail}
            error={emailError}
          />
          <div className="form-control">
            <button type="submit" className="btn btn-large">
              Submit
            </button>
          </div>
        </form>
        <div className="details">
          {loading ? (
            <Loader
              type="Oval"
              color="var(--main-color)"
              height={50}
              width={50}
            />
          ) : details ? (
            <p>{details}</p>
          ) : null}
        </div>
      </div>
    </main>
  );
}

export default ForgotPage;
