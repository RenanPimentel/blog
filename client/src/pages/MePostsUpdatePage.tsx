import React, { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const [singlePost, setSinglePost] = useState<IPost>({});
  const { post_id } = useParams<{ post_id: string }>();
  const { updateMyPost } = useContext(MainContext);

  useEffect(() => {
    api.get(`/posts/${post_id}`).then(res => {
      setSinglePost(res.data.data.post);
    });
  }, [post_id]);

  const sendPost = async (post: {
    title: string;
    topic: string;
    content: string;
  }) => {
    updateMyPost(post_id, post);
    await api.put(`/posts/${post_id}`, { post });
    updateMyPost(post_id, post);
  };

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      <CreatePost sendPost={sendPost} {...singlePost} />
    </main>
  );
}

export default MePostsUpdatePage;
