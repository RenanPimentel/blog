import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";

function MePage() {
  const { me } = useContext(MainContext) as MainContext;

  if (!me?.id) {
    return (
      <main className="wrapper">
        <h1>You are not logged in!</h1>
        <Link className="link" to="/login">
          Do you have an account? Login
        </Link>
        <br />
        <Link className="link" to="/register">
          Create your own account! Register
        </Link>
      </main>
    );
  }

  return (
    <main className="wrapper">
      <h1>Welcome {me.username}!</h1>
    </main>
  );
}

export default MePage;
