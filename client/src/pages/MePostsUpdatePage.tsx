import React, { useContext, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import PostEdit from "../components/PostEdit";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const { updateMyPost, setTitle } = useContext(MainContext);
  const { post_id } = useParams<{ post_id: string }>();
  const history = useHistory();

  const sendPost = async (post: IPost) => {
    await api.put(`/posts/${post_id}`, { post });
    updateMyPost(post_id, post);
    history.push("/me/posts");
  };

  useEffect(() => {
    setTitle("Update Posts • Three Dots");
  }, [setTitle]);

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      <PostEdit />
      {/* <CreatePost sendPost={sendPost} postId={post_id} /> */}
    </main>
  );
}

export default MePostsUpdatePage;
