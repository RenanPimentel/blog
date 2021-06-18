import React, {
  MutableRefObject,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { useHistory } from "react-router-dom";
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
      await api.post("/login", { login, password });
      history.push("/me");
      getMe();
    } catch (err) {
      console.dir(err);
      const errors: DataError[] = err.response.data.errors;

      errors.forEach(e => {
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
