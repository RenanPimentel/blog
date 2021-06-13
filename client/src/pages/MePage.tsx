import React, { useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { Link } from "react-router-dom";
import { MyContext } from "../context/context";
import { api } from "../util/api";

function MePage() {
  const [cookies] = useCookies(["me"]);
  const { setMe } = useContext(MyContext) as MainContext;

  useEffect(() => {
    (async () => {
      const me = await api.post("/me", { me: cookies.me });
      setMe(me.data.user);
    })();
  }, []);

  if (!cookies.me) {
    return (
      <main className="wrapper">
        <h1>You are not logged in!</h1>
        <Link className="btn btn-large no-bg" to="/login">
          Do you have an account? Login
        </Link>
        <Link className="btn btn-large no-bg" to="/register">
          Create your account! Register
        </Link>
      </main>
    );
  }

  return <main className="wrapper"></main>;
}

export default MePage;
