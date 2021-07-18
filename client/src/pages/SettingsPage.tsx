import React, { useContext, useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { MdClose } from "react-icons/md";
import Input from "../components/Input";
import { MainContext } from "../context/context";
import { api } from "../util/api";

interface Popup {
  label: string;
  defaultValue: string;
  change: "banner" | "avatar" | "username";
}

function SettingsPage() {
  const { me, defaultAvatar, defaultBanner } = useContext(MainContext);
  const [popup, setPopup] = useState<null | Popup>(null);
  const [popupInputVal, setPopupInputVal] = useState("");
  const [popupError, setPopupError] = useState("");

  const popBanner = () => {
    setPopup({
      label: "Change your banner",
      defaultValue: me.banner || "",
      change: "banner",
    });
  };

  const popAvatar = () => {
    setPopup({
      label: "Change your avatar",
      defaultValue: me.avatar || "",
      change: "avatar",
    });
  };

  const popUsername = () => {
    setPopup({
      label: "Change your username",
      defaultValue: me.username || "",
      change: "username",
    });
  };

  const handleFadeClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const toClose =
      (e.target as HTMLElement).classList.contains("close") ||
      (e.target as HTMLElement).parentElement?.classList.contains("close");

    if (toClose) setPopup(null);
  };

  const handlePopupSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!popup) return;

    try {
      await api.post("/me/change", {
        avatar: me.avatar,
        banner: me.banner,
        username: me.username,
        [popup.change]: popupInputVal,
      });
    } catch (err) {
      const error =
        err?.response?.data?.errors
          ?.map((e: FieldError) => e.reason)
          ?.join(", ") || "";

      setPopupError(error);
    }
  };

  useEffect(() => {
    setPopupInputVal(popup?.defaultValue || "");
  }, [popup]);

  return (
    <>
      {popup && (
        <div className="popup-fade close" onClick={handleFadeClick}>
          <div className="popup-container">
            <div className="close-btn-container">
              <button className="link close red">
                <MdClose
                  className="close"
                  style={{ height: "25px", width: "25px" }}
                />
              </button>
            </div>
            <form onSubmit={handlePopupSubmit}>
              <Input
                value={popupInputVal}
                setValue={setPopupInputVal}
                label={popup.label}
                error={popupError}
                setError={setPopupError}
                maxChars={512}
              />
              <div className="left" style={{ display: "flex" }}>
                <button type="submit" className="btn large">
                  Send
                </button>
              </div>
            </form>
            {popup.change === "banner" && (
              <div className="popup-preview">
                <div className="profile-banner">
                  <img src={popupInputVal || defaultBanner} alt="preview" />
                </div>
              </div>
            )}
            {popup.change === "avatar" && (
              <div className="popup-preview">
                <div
                  className="profile-picture pic-large"
                  style={{ margin: "0", transform: "none" }}
                >
                  <img src={popupInputVal || defaultBanner} alt="preview" />
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      <main className="wrapper">
        <div className="container change-settings">
          <div className="line-v"></div>
          <div className="profile">
            <div
              onClick={popBanner}
              style={{ cursor: "pointer" }}
              className="profile-banner hiding"
            >
              <img
                src={me.banner || defaultBanner}
                alt={`${me.username} banner`}
              />
              <div className="show">
                <FaRegEdit />
              </div>
            </div>
            <div className="under-profile-banner">
              <div className="same-line right top">
                <span
                  onClick={popAvatar}
                  style={{ cursor: "pointer" }}
                  className="profile-picture hiding"
                >
                  <img
                    src={me.avatar || defaultAvatar}
                    alt={`${me.username} avatar`}
                  />
                  <div className="show">
                    <FaRegEdit />
                  </div>
                </span>
                <h2 className="username">
                  <span
                    onClick={popUsername}
                    style={{ marginTop: "10px", cursor: "pointer" }}
                  >
                    {me.username}
                    <FaRegEdit style={{ marginLeft: "1rem" }} />
                  </span>
                </h2>
              </div>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}

export default SettingsPage;
