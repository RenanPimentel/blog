import React, { useEffect, useContext, useState } from "react";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function ChangeName() {
  const context = useContext(MainContext);
  const [changingName, setChangingName] = useState(context.me?.username || "");
  const [error, setError] = useState("");

  useEffect(() => {
    setChangingName(context.me?.username || "");
  }, [context]);

  const setUsername = async () => {
    try {
      const response = await api.post("/me/username", {
        username: changingName,
      });
      context.setMe(response.data.data.user);
    } catch (err) {
      setError(
        err.response.data.errors.map((e: FieldError) => e.reason).join(", ")
      );

      setTimeout(() => setError(""), 3000);
    }
  };

  return (
    <div>
      <h2>Change your username</h2>
      <div className="border-left">
        <div className="settings">
          <h4>
            <label htmlFor="name">New username</label>
          </h4>
          <input
            type="text"
            id="name"
            onChange={e => setChangingName(e.target.value)}
            value={changingName}
          />
        </div>
        {error && <span className="error btn-large">{error}</span>}
        {changingName === context.me?.username || changingName === "" ? (
          <button title="missing username" disabled className="btn btn-large">
            Set
          </button>
        ) : (
          <button onClick={setUsername} className="btn btn-large">
            Set
          </button>
        )}
      </div>
    </div>
  );
}

export default ChangeName;
