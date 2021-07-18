import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { MainContext } from "../context/context";

interface Props {
  notFound?: string;
}

function NotFoundPage({ notFound }: Props) {
  const { setTitle } = useContext(MainContext);
  const history = useHistory();

  useEffect(() => {
    setTitle("Not Found • Three Dots");
  }, [setTitle]);

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
