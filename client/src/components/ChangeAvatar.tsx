import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function ChangeAvatar() {
  const { me, defaultAvatar, setMe } = useContext(MainContext);
  const [avatar, setAvatar] = useState(me?.avatar || defaultAvatar);
  const [preview, setPreview] = useState(me?.avatar || "");
  const [error, setError] = useState("");

  const setProfilePicture = async () => {
    const response = await api.post("/me/avatar", { avatar });
    setMe(response.data.data.user);
  };

  useEffect(() => {
    setAvatar(me?.avatar || defaultAvatar);
    setPreview(me?.avatar || "");
  }, [defaultAvatar, me]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(preview);
        const blob = await response.blob();
        if (blob.size > 100_000) {
          setError("Select a smaller image");
          setTimeout(() => setError(""), 3000);
          setAvatar(defaultAvatar);
        } else if (blob.type.startsWith("image/")) {
          setAvatar(preview);
        } else {
          setAvatar(defaultAvatar);
        }
      } catch (e) {
        setAvatar(defaultAvatar);
      }
    })();
  }, [defaultAvatar, preview]);

  return (
    <div>
      <h2>Change your avatar</h2>
      <div className="border-left">
        <h3>Preview</h3>
        <div className="profile-picture pic-large">
          <img src={avatar} alt="your avatar" />
        </div>
        <div className="settings">
          <h4>
            <label htmlFor="url">Paste an url here</label>
          </h4>
          <input
            type="text"
            id="url"
            placeholder="https://images.unsplash.com/photo-1602694866292-c0597a4452b2?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            onChange={e => setPreview(e.target.value)}
            value={preview}
          />
        </div>
        {error && <span className="error btn-large">{error}</span>}
        {avatar === defaultAvatar || avatar === me?.avatar ? (
          <button title="missing image" disabled className="btn btn-large">
            Set
          </button>
        ) : (
          <button onClick={setProfilePicture} className="btn btn-large">
            Set
          </button>
        )}
      </div>
    </div>
  );
}

export default ChangeAvatar;
