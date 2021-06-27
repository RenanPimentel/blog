import React from "react";
import { useHistory } from "react-router-dom";

interface Props {
  notFound?: string;
}

function NotFoundPage({ notFound }: Props) {
  const history = useHistory();

  return (
    <div className="wrapper">
      <h1>{notFound} not found</h1>
      <button
        className="link large"
        onClick={() => history.goBack()}
        style={{ textDecoration: "underline", padding: "0" }}
      >
        Go Back
      </button>
    </div>
  );
}

NotFoundPage.defaultProps = {
  notFound: "Page",
};

export default NotFoundPage;
