import React, { useContext } from "react";
import { useHistory, useParams } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const { updateMyPost } = useContext(MainContext);
  const { post_id } = useParams<{ post_id: string }>();
  const history = useHistory();

  const sendPost = async (post: IPost) => {
    await api.put(`/posts/${post_id}`, { post });
    updateMyPost(post_id, post);
    history.push("/me/posts");
  };

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      <CreatePost sendPost={sendPost} postId={post_id} />
    </main>
  );
}

export default MePostsUpdatePage;
