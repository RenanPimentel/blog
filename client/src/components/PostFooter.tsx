import React, { useEffect, useState } from "react";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { api } from "../util/api";

interface Props extends IPost {}

function PostFooter(props: Props) {
  const [like, setLike] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [viewCount, setViewCount] = useState(0);

  const toggleLike = async () => {
    if (like) {
      await api.delete(`/posts/likes/${props.id}`);
      setLikeCount(Number(likeCount) - 1);
      setLike(false);
    } else {
      await api.post(`/posts/likes/${props.id}`);
      setLikeCount(Number(likeCount) + 1);
      setLike(true);
    }
  };

  useEffect(() => {
    (async () => {
      if (props.id) {
        const countResponse = await api.get(`/posts/likes/${props.id}/count`);
        setLikeCount(countResponse.data.data.count);

        const boolResponse = await api.get(`/posts/likes/${props.id}`);
        setLike(boolResponse.data.data.like);

        const viewsResponse = await api.get(`/posts/views/${props.id}/count`);
        setViewCount(viewsResponse.data.data.count);
      }
    })();
  }, [props.id]);

  return (
    <footer>
      <div className="same-line right">
        <button onClick={toggleLike} className="link large red center">
          {like ? <FaHeart /> : <FaRegHeart />}
        </button>
        <p className="red">{likeCount}</p>
      </div>
      <p>
        {viewCount} view{Number(viewCount) === 1 ? "" : "s"}
      </p>
    </footer>
  );
}

export default PostFooter;
