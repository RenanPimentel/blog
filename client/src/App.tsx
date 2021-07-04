import React, { useContext } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Navbar from "./components/Navbar";
import ToggleDark from "./components/ToggleDark";
import { MainContext } from "./context/context";
import ForgotPage from "./pages/ForgotPage";
import HomePage from "./pages/HomePage";
import LegalPage from "./pages/LegalPage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";
import MePostsCreatePage from "./pages/MePostsCreatePage";
import MePostsPage from "./pages/MePostsPage";
import MePostsUpdatePage from "./pages/MePostsUpdatePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import RegisterPage from "./pages/RegisterPage";
import ResetpassPage from "./pages/ResetpassPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import UserPage from "./pages/UserPage";

function App() {
  const { me } = useContext(MainContext);
  const ws = new WebSocket("ws://localhost:4000/api/v1");

  ws.addEventListener("open", () => {
    ws.send(JSON.stringify({ id: me.id, password: me.password }));
  });

  return (
    <BrowserRouter>
      <Navbar />
      <ToggleDark />
      <Switch>
        <Route exact path="/">
          <HomePage />
        </Route>
        <Route exact path="/login">
          <LoginPage />
        </Route>
        <Route exact path="/login/forgot">
          <ForgotPage />
        </Route>
        <Route exact path="/register">
          <RegisterPage />
        </Route>
        <Route exact path="/resetpass">
          <ResetpassPage />
        </Route>
        <Route exact path="/settings">
          <SettingsPage />
        </Route>
        <Route exact path="/search">
          <SearchPage />
        </Route>
        <Route exact path="/legal">
          <LegalPage />
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
        <Route exact path="/me/posts/:post_id/update">
          <MePostsUpdatePage />
        </Route>
        <Route exact path="/posts/:post_id">
          <PostPage />
        </Route>
        <Route exact path="/users/:user_id">
          <UserPage />
        </Route>
        <Route path="*">
          <NotFoundPage />
        </Route>
      </Switch>
    </BrowserRouter>
  );
}

export default App;
