import React, { useContext, useEffect } from "react";
import { BrowserRouter, Route, Switch } from "react-router-dom";
import Footer from "./components/Footer";
import Navbar from "./components/Navbar";
import ToggleDark from "./components/ToggleDark";
import { MainContext } from "./context/context";
import ForgotPage from "./pages/ForgotPage";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import MePage from "./pages/MePage";
import MePostsCreatePage from "./pages/MePostsCreatePage";
import MePostsPage from "./pages/MePostsPage";
import MePostsUpdatePage from "./pages/MePostsUpdatePage";
import NotFoundPage from "./pages/NotFoundPage";
import PostPage from "./pages/PostPage";
import PrivacyPage from "./pages/PrivacyPage";
import RegisterPage from "./pages/RegisterPage";
import ResetpassPage from "./pages/ResetpassPage";
import SearchPage from "./pages/SearchPage";
import SettingsPage from "./pages/SettingsPage";
import TermsPage from "./pages/TermsPage";
import UserPage from "./pages/UserPage";
import { api } from "./util/api";

function App() {
  const { me, socket, notifications, setNotifications } =
    useContext(MainContext);

  socket?.once("connect", () => {
    if (me.id) socket?.emit("connect_message", me);
  });

  socket?.on("notification", (msg: INotification) => {
    setNotifications([msg, ...notifications]);
  });

  useEffect(() => {
    (async () => {
      const response = await api.get("/notifications");
      setNotifications(response.data.data.notifications);
    })();
  }, [setNotifications]);

  useEffect(() => {
    /* TODO: add a sound effect */
    if (notifications.length === 0) {
      document.title = document.title.replace(/\([0-9]+\)/g, "");
    } else {
      document.title = document.title.match(/\([0-9]+\)/g)
        ? document.title.replace(/\([0-9]+\)/g, `(${notifications.length})`)
        : `${document.title} (${notifications.length})`;
    }
  }, [notifications]);

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
        <Route exact path="/terms">
          <TermsPage />
        </Route>
        <Route exact path="/privacy">
          <PrivacyPage />
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
      <Footer />
    </BrowserRouter>
  );
}

export default App;
