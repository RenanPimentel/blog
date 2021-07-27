import React, { useCallback, useContext, useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import PostEdit from "../components/PostEdit";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsUpdatePage() {
  const { updateMyPost, setTitle } = useContext(MainContext);
  const [post, setPost] = useState<IPost>({});
  const { post_id } = useParams<{ post_id: string }>();
  const history = useHistory();

  const updatePost = async (post: IPost) => {
    await api.put(`/posts/${post_id}`, { post });
    updateMyPost(post_id, post);
    history.push("/me/posts");
  };

  const getPost = useCallback(async () => {
    const postResponse = await api.get<PostResponse>(`/posts/${post_id}`);
    setPost(postResponse.data.data.post);
  }, [post_id]);

  useEffect(() => {
    getPost();
  }, [getPost]);

  useEffect(() => {
    setTitle(`Update ${post.title} • Three Dots`);
  }, [post.title, setTitle]);

  if (!post.id) {
    return <></>;
  }

  return (
    <main className="wrapper">
      <h2>Update your post</h2>
      <PostEdit
        sendPost={updatePost}
        content={post.content}
        title={post.title}
        topic={post.topic}
      />
    </main>
  );
}

export default MePostsUpdatePage;
