import React from "react";
import { useHistory } from "react-router-dom";

function ErrorPage() {
  const history = useHistory();
  const sendBack = () => {
    history.goBack();
  };

  return (
    <div className="wrapper">
      <h1>Page not found</h1>
      <button className="btn" onClick={sendBack}>
        Go Back
      </button>
    </div>
  );
}

export default ErrorPage;
