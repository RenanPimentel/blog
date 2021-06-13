import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { MyContextProvider } from "./context/context";
import "./index.css";
import { CookiesProvider } from "react-cookie";

ReactDOM.render(
  <CookiesProvider>
    <MyContextProvider>
      <App />
    </MyContextProvider>
  </CookiesProvider>,
  document.getElementById("root")
);
