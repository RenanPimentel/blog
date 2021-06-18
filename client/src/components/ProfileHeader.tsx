import React from "react";

interface Props extends IUser {}

function ProfileHeader({ banner, avatar, username }: Props) {
  return (
    <header>
      <div className="line-v"></div>
      <div className="profile">
        <div className="profile-banner">
          <img src={banner} alt="your banner" />
        </div>
        <div className="same-line right top">
          <div className="profile-picture">
            <img src={avatar} alt="your avatar" />
          </div>
          <h2 className="username">{username}</h2>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
