import React, { useState } from "react";
import { FaRegHeart, FaHeart } from "react-icons/fa";

function PostFooter() {
  const [like, setLike] = useState(false);

  const toggleLike = () => {
    setLike(!like);
  };

  return (
    <div>
      <button onClick={toggleLike} className="link large">
        {like ? <FaHeart /> : <FaRegHeart />}
      </button>
    </div>
  );
}

export default PostFooter;
