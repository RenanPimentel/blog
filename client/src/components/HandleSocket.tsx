import React, { useContext, useEffect } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function HandleSocket() {
  const { me, socket, notifications, setNotifications, title, setTitle } =
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
    if (notifications.length === 0) {
      setTitle(title.replace(/\([0-9]+\)/g, ""));
    } else {
      setTitle(
        title.match(/\([0-9]+\)$/g)
          ? title.replace(/\([0-9]+\)/g, `(${notifications.length})`)
          : `${title} (${notifications.length})`
      );
    }
  }, [notifications, setTitle, title]);

  useEffect(() => {
    document.title = title;
  }, [title]);

  return <></>;
}

export default HandleSocket;
