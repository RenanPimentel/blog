import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import { MainContext } from "../context/context";

interface Params {
  user_id: string;
}

function UserPage() {
  const context = useContext(MainContext);
  const history = useHistory();
  const { user_id } = useParams() as Params;

  if (user_id === context.me.id) {
    history.push("/me");
  }

  return <main className="wrapper">User {user_id} Page</main>;
}

export default UserPage;
