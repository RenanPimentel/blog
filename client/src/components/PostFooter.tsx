import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { api } from "../util/api";

interface Props extends IPost {}

function PostFooter(props: Props) {
  const [likes, setLikes] = useState(false);
  const [likeCount, setLikeCount] = useState(0);

  const toggleLike = async () => {
    if (likes) {
      await api.delete(`/posts/${props.id}/likes`);
      setLikeCount(likeCount - 1);
      setLikes(false);
    } else {
      await api.post(`/posts/${props.id}/likes`);
      setLikeCount(likeCount + 1);
      setLikes(true);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.id) {
        const countPromise = api.get<CountResponse>(
          `/posts/${props.id}/likes/count`
        );
        const boolPromise = api.get<LikesResponse>(`/posts/${props.id}/likes`);

        const [countResponse, boolResponse] = await Promise.all([
          countPromise,
          boolPromise,
        ]);

        setLikeCount(Number(countResponse.data.data.count));
        setLikes(boolResponse.data.data.likes);
      }
    })();
  }, [props.id]);

  return (
    <footer className="post-footer">
      <div className="same-line right">
        <button
          onClick={toggleLike}
          className="link red center"
          title="Like"
          style={{ padding: 0 }}
        >
          {likes ? <FaHeart /> : <FaRegHeart />}
        </button>
        <p>{likeCount}</p>
      </div>
    </footer>
  );
}

export default PostFooter;
