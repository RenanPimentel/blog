import React, { useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { MyContext } from "../context/context";
import { api } from "../util/api";

function MePage() {
  const { me, setMe } = useContext(MyContext) as MainContext;

  useEffect(() => {
    (async () => {
      const response = await api.get("/me");
      setMe(response.data.user);
    })();
  }, []);

  if (!me) {
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

  return (
    <main className="wrapper">
      <h1>you are {me.username}</h1>
    </main>
  );
}

export default MePage;
