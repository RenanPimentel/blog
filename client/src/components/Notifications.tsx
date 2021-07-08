import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { FaRegBell } from "react-icons/fa";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import Notification from "./Notification";

function Notifications() {
  const { notifications, setNotifications } = useContext(MainContext);
  const notificationsContainerDiv = useRef<HTMLDivElement>(null);
  const [authors, setAuthors] = useState<IUser[]>([]);

  const toggleNotificationContainer = () => {
    notificationsContainerDiv.current?.classList.toggle("show");
  };

  const dismissAll = async () => {
    await api.delete("/notifications");
    setNotifications([]);
  };

  useEffect(() => {
    const promises = notifications.map(ntf =>
      api.get<UserResponse>(`/users/${ntf.sender_id}`)
    );
    Promise.all(promises).then(res =>
      setAuthors(res.map(r => r.data.data.user))
    );
  }, [notifications]);

  const anyParentContains = useCallback(
    (target: HTMLElement | null, className: string): boolean => {
      if (!target) return false;
      if (target.classList.contains(className)) return true;
      return anyParentContains(target.parentElement, className);
    },
    []
  );

  const isClickable = useCallback((target: HTMLElement | null): boolean => {
    if (!target) return false;
    if (target.nodeName.toLowerCase().match(/a|(button)/)) return true;
    return isClickable(target.parentElement);
  }, []);

  useEffect(() => {
    window.addEventListener("click", e => {
      const target = e.target as HTMLElement;

      if (
        !anyParentContains(target, "notifications-container") ||
        !isClickable(target)
      )
        notificationsContainerDiv.current?.classList.remove("show");
    });
  }, [anyParentContains, isClickable]);

  if (notifications.length === 0) {
    return <></>;
  }

  return (
    <div className="notifications-container">
      <div
        className="notification-bell-container"
        onClick={toggleNotificationContainer}
      >
        <FaRegBell className="notification-bell" />
        {notifications.length > 0 && <div className="red-circle"></div>}
      </div>
      <div className="notifications" ref={notificationsContainerDiv}>
        {notifications.map((ntf, i) => (
          <Notification {...ntf} author={authors[i]} key={i} />
        ))}
        <div className="dismiss-all-not-btn">
          <button onClick={dismissAll}>Dismiss All</button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
