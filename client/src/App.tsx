import React from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import ErrorPage from "./pages/ErrorPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";
import MePostsCreatePage from "./pages/MePostsCreatePage";
import MePostsPage from "./pages/MePostsPage";
import MePostsUpdatePage from "./pages/MePostsUpdatePage";
import RegisterPage from "./pages/RegisterPage";
import UserPage from "./pages/UserPage";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/me">
          <MePage />
        </Route>
        <Route exact path="/me/posts">
          <MePostsPage />
        </Route>
        <Route exact path="/me/posts/create">
          <MePostsCreatePage />
        </Route>
        <Route exact path="/me/posts/update/:post_id">
          <MePostsUpdatePage />
        </Route>
        <Route exact path="/users/:user_id">
          <UserPage />
        </Route>
        <Route path="*">
          <ErrorPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
