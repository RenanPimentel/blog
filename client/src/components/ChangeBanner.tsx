import React, { useContext, useEffect, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function ChangeBanner() {
  const { me, defaultBanner, setMe } = useContext(MainContext);
  const [banner, setBanner] = useState(me?.banner || defaultBanner);
  const [preview, setPreview] = useState(me?.banner || "");
  const [error, setError] = useState("");

  const setProfileBanner = async () => {
    const response = await api.post("/me/banner", { banner });
    setMe(response.data.data.user);
  };

  useEffect(() => {
    setBanner(me?.banner || defaultBanner);
    setPreview(me?.banner || "");
  }, [defaultBanner, me]);

  useEffect(() => {
    (async () => {
      try {
        const response = await fetch(preview);
        const blob = await response.blob();
        if (blob.size > 100_000) {
          setError("Select a smaller image");
          setTimeout(() => setError(""), 3000);
          setBanner(defaultBanner);
        } else if (blob.type.startsWith("image/")) {
          setBanner(preview);
        } else {
          setBanner(defaultBanner);
        }
      } catch (e) {
        setBanner(defaultBanner);
      }
    })();
  }, [defaultBanner, preview]);

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
        {banner === defaultBanner || banner === me?.banner ? (
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
