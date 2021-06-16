import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function ChangeBanner() {
  const context = useContext(MainContext);
  const [banner, setBanner] = useState(
    context.me?.banner || context.defaultBanner
  );
  const [preview, setPreview] = useState(context.me?.banner || "");
  const [error, setError] = useState("");

  const setProfileBanner = async () => {
    const response = await api.post("/me/banner", { banner });
    context.setMe(response.data.data.user);
  };

  useEffect(() => {
    setBanner(context.me?.banner || context.defaultBanner);
    setPreview(context.me?.banner || "");
  }, [context.defaultBanner, context.me]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(preview);
        const blob = await response.blob();
        if (blob.size > 100_000) {
          setError("Select a smaller image");
          setTimeout(() => setError(""), 3000);
          setBanner(context.defaultBanner);
        } else if (blob.type.startsWith("image/")) {
          setBanner(preview);
        } else {
          setBanner(context.defaultBanner);
        }
      } catch (e) {
        setBanner(context.defaultBanner);
      }
    })();
  }, [context.defaultBanner, preview]);

  return (
    <div>
      <h2>Change your banner</h2>
      <div className="border-left">
        <h3>Preview</h3>
        <div className="profile-banner">
          <img src={banner} alt="your banner" />
        </div>
        <div className="settings">
          <h4>
            <label htmlFor="banner">Paste an url here</label>
          </h4>
          <input
            type="text"
            id="banner"
            placeholder="https://images.unsplash.com/photo-1622988869811-a4f3d3fe5441?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80"
            onChange={e => setPreview(e.target.value)}
            value={preview}
          />
        </div>
        {error && <span className="error btn-large">{error}</span>}
        {banner === context.defaultBanner || banner === context.me?.banner ? (
          <button title="missing image" disabled className="btn btn-large">
            Set
          </button>
        ) : (
          <button onClick={setProfileBanner} className="btn btn-large">
            Set
          </button>
        )}
      </div>
    </div>
  );
}

export default ChangeBanner;
