import React from "react";
import { useHistory } from "react-router-dom";

interface Props {
  notFound?: string;
}

function ErrorPage({ notFound }: Props) {
  const history = useHistory();
  const sendBack = () => {
    history.goBack();
  };

  return (
    <div className="wrapper">
      <h1>{notFound} not found</h1>
      <button
        className="link large"
        onClick={sendBack}
        style={{ textDecoration: "underline", padding: "0" }}
      >
        Go Back
      </button>
    </div>
  );
}

ErrorPage.defaultProps = {
  notFound: "Page",
};

export default ErrorPage;
