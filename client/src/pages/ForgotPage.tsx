import React, { useState } from "react";
import Input from "../components/Input";
import { api } from "../util/api";

function ForgotPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [details, setDetails] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await api.post("/account/forgot", { email });
      setEmail("");
      setDetails(
        `An email was sent to you by '${response.data.data.emailRes.name}' with your new password it may be in the span folder`
      );
    } catch (err) {
      console.dir(err);
      setEmailError(
        err.response.data.errors.map((e: FieldError) => e.reason).join(", ")
      );

      setTimeout(() => {
        setEmailError("");
      }, 3000);
    }
  };

  return (
    <main className="wrapper">
      <div className="form-container">
        <form onSubmit={handleSubmit}>
          <Input
            label="Your email"
            onChange={e => setEmail(e.target.value)}
            value={email}
            className="input"
            type="email"
            id="email"
            placeholder="me@example.com"
            error={emailError}
          />
          <div className="form-control">
            <button type="submit" className="btn btn-large">
              Submit
            </button>
          </div>
        </form>
        {details && <p>{details}</p>}
      </div>
    </main>
  );
}

export default ForgotPage;
