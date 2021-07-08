import React, { useEffect, useState } from "react";
import { FaUserSlash, FaUserPlus } from "react-icons/fa";
import { api } from "../util/api";

interface Props {
  user_id?: string;
}

function FollowButton({ user_id }: Props) {
  const [followerCount, setFollowerCount] = useState(0);
  const [isFollowing, setIsFollowing] = useState(false);

  useEffect(() => {
    (async () => {
      if (!user_id) return;
      const response = await api.get<FollowerCountResponse>(
        `/users/${user_id}/followers/count`
      );

      setFollowerCount(Number(response.data.data.count));
      setIsFollowing(response.data.data.follows);
    })();
  }, [user_id]);

  const handleClick = async () => {
    await api.post(`/users/${user_id}/follow`);
    if (isFollowing) {
      setIsFollowing(false);
      setFollowerCount(Number(followerCount) - 1);
    } else {
      setIsFollowing(true);
      setFollowerCount(Number(followerCount) + 1);
    }
  };

  return (
    <div className="follow-container">
      <div
        className="same-line"
        style={{ alignItems: "center", justifyContent: "center" }}
      >
        <span>{followerCount}</span>
        <button
          title={isFollowing ? "Unfollow" : "Follow"}
          onClick={handleClick}
          className="link"
          style={{ height: "16px" }}
        >
          {isFollowing ? <FaUserSlash /> : <FaUserPlus />}
        </button>
      </div>
    </div>
  );
}

export default FollowButton;
