import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const { updateMyPost } = useContext(MainContext);
  const [singlePost, setSinglePost] = useState<IPost>({});
  const { post_id } = useParams<{ post_id: string }>();
  const history = useHistory();

  useEffect(() => {
    api
      .get<PostResponse>(`/posts/${post_id}`)
      .then(res => setSinglePost(res.data.data.post));
  }, [post_id]);

  const sendPost = async (post: IPost) => {
    await api.put(`/posts/${post_id}`, { post });
    updateMyPost(post_id, post);
    history.push("/me/posts");
  };

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      <CreatePost sendPost={sendPost} {...singlePost} />
    </main>
  );
}

export default MePostsUpdatePage;
