import React, { useContext, useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useHistory } from "react-router-dom";
import { MainContext } from "../context/context";
import { api } from "../util/api";
import BtnContainer from "./BtnContainer";
import FollowButton from "./FollowButton";

interface Props extends IUser {
  post_id: string;
  getViews: boolean;
  showFollow: boolean;
  isAuthor: boolean;
}

function ProfileHeader({
  banner,
  avatar,
  username,
  id,
  post_id,
  getViews,
  showFollow,
  isAuthor,
}: Props) {
  const context = useContext(MainContext);
  const [viewCount, setViewCount] = useState(0);
  const history = useHistory();

  useEffect(() => {
    (async () => {
      if (id && getViews && post_id) {
        const viewsResponse = await api.get(`/posts/views/${post_id}/count`);
        setViewCount(viewsResponse.data.data.count);
      }
    })();
  }, [id, post_id, getViews]);

  const handleEditClick = () => {
    history.push(`/me/posts/${post_id}/update`);
  };

  const handleRemoveClick = async () => {
    await api.delete(`/posts/${post_id}`);
  };

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
            <h2 className="username" style={{ marginTop: "10px" }}>
              {username}
            </h2>
            <div>
              {isAuthor && (
                <>
                  <br />
                  <BtnContainer
                    showEdit={true}
                    showRemove={true}
                    handleEditClick={handleEditClick}
                    handleRemoveClick={handleRemoveClick}
                  />
                </>
              )}
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
      </div>
    </header>
  );
}

export default ProfileHeader;
