import React, { useContext, useEffect, useState } from "react";
import { MyContext } from "../context/context";
import { api } from "../util/api";

function ChangeAvatar() {
  const context = useContext(MyContext);
  const [avatar, setAvatar] = useState(
    context.me.avatar || context.defaultAvatar
  );
  const [preview, setPreview] = useState(context.me.avatar || "");
  const [error, setError] = useState("");

  const setProfilePicture = async () => {
    const post = await api.post("/me/avatar", { avatar });
    context.setMe(post.data.user);
    console.log(post.data.user);
  };

  useEffect(() => {
    setAvatar(context.me.avatar || context.defaultAvatar);
    console.log(context.me.avatar);
  }, [context.defaultAvatar, context.me]);

  useEffect(() => {
    (async () => {
      try {
        const blob = await (await fetch(preview)).blob();
        if (blob.size > 100_000) {
          setError("Select a smaller image");
          setTimeout(() => {
            setError("");
          }, 3000);
          setAvatar(context.defaultAvatar);
        } else if (blob.type.startsWith("image/")) {
          setAvatar(preview);
          console.log(blob);
        } else {
          setAvatar(context.defaultAvatar);
        }
      } catch (e) {
        setAvatar(context.defaultAvatar);
      }
    })();
  }, [context.defaultAvatar, preview]);

  return (
    <div>
      <h2>Change your avatar</h2>
      <div className="border-left">
        <h3>Preview</h3>
        <div className="profile-picture pic-large">
          <img src={avatar} alt="your profile" width="100" height="100" />
        </div>
        <div className="url-settings">
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
        {error ? (
          <span className="error btn-large">{error}</span>
        ) : (
          <span></span>
        )}
        {avatar === context.defaultAvatar ? (
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
