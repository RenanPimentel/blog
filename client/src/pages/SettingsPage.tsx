import React from "react";
import ChangeAvatar from "../components/ChangeAvatar";
import ChangeBanner from "../components/ChangeBanner";
import ChangeName from "../components/ChangeName";

function SettingsPage() {
  return (
    <main className="wrapper">
      <ChangeName />
      <ChangeAvatar />
      <ChangeBanner />
    </main>
  );
}

export default SettingsPage;
