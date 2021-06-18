import React from "react";

function SendComment() {
  return (
    <form className="send-comment">
      <div className="form-control comment-div">
        <input type="text" className="input" />
        <button className="btn large">Comment</button>
      </div>
    </form>
  );
}

export default SendComment;
