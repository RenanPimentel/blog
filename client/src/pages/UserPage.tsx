import React from "react";
import { useParams } from "react-router-dom";

interface Params {
  user_id: string;
}

function UserPage() {
  const { user_id } = useParams() as Params;
  return <div>User {user_id} Page</div>;
}

export default UserPage;
