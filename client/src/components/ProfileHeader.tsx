import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import FollowButton from "./FollowButton";

interface Props extends IUser {
  post_id: string;
  getViews: boolean;
  showFollow: boolean;
}

function ProfileHeader({
  banner,
  avatar,
  username,
  id,
  post_id,
  getViews,
  showFollow,
}: Props) {
  const context = useContext(MainContext);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    (async () => {
      if (id && getViews && post_id) {
        const viewsResponse = await api.get(`/posts/views/${post_id}/count`);
        setViewCount(viewsResponse.data.data.count);
      }
    })();
  }, [id, post_id, getViews]);

  return (
    <header>
      <div className="line-v"></div>
      <div className="profile">
        <div className="profile-banner">
          <img
            src={banner || context.defaultBanner}
            alt={`${username} banner`}
          />
        </div>
        <div className="under-profile-banner">
          <div className="same-line right top">
            <Link
              to={id === context.me.id ? "/me" : `/users/${id}`}
              className="profile-picture"
            >
              <img
                src={avatar || context.defaultAvatar}
                alt={`${username} avatar`}
              />
            </Link>
            <h2 className="username">{username}</h2>
            <div className="views center">
              {getViews ? (
                <>
                  <FaEye />
                  <p></p>
                  <span>{viewCount}</span>
                </>
              ) : showFollow ? (
                <FollowButton user_id={id} />
              ) : (
                <></>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default ProfileHeader;
