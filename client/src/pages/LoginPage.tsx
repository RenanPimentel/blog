import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { Link, useHistory } from "react-router-dom";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";

type DataError = { field: string; reason: string };

function LoginPage() {
  const formEl: MutableRefObject<null | HTMLFormElement> = useRef(null);
  const { me, getMe } = useContext(MainContext) as MainContext;
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
      await api.post("/account/login", { login, password });
      // eslint-disable-next-line no-restricted-globals
      location.reload();
      history.push("/me");

      getMe();
    } catch (err) {
      console.dir(err);
      const errors: DataError[] = err.response?.data.errors;

      errors?.forEach(e => {
        if (e.field === "login") {
          setLoginError(e.reason);
        } else if (e.field === "password") {
          setPasswordError(e.reason);
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
            inputDetails={{
              className: "input",
              type: "text",
              placeholder: "AwesomeName",
            }}
            label="Login"
            value={login}
            setValue={setLogin}
            error={loginError}
          />
          <Input
            inputDetails={{
              className: "input",
              type: "password",
              placeholder: "my safe password",
            }}
            label="Password"
            value={password}
            setValue={setPassword}
            error={passwordError}
          />
          <div className="form-control">
            <button type="submit" className="btn btn-large">
              Submit
            </button>
          </div>
          <Link to="/login/forgot">forget password</Link>
        </form>
      </div>
    </main>
  );
}

export default LoginPage;
