import React from "react";
import { useContext } from "react";
import { useHistory } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreatePage() {
  const { addMyPost, socket, me } = useContext(MainContext);
  const history = useHistory();

  const sendPost = async (post: {
    title: string;
    topic: string;
    content: string;
  }) => {
    const response = await api.post<PostResponse>("/posts", { post: post });
    const { post: completePost } = response.data.data;
    addMyPost(completePost);

    const data = { type: "post", from: me.id, content: completePost.title };

    socket.emit("notification", { for: [completePost.author_id], data });

    api.post("/notifications", data);

    history.push(`/posts/${completePost.id}`);
  };

  return (
    <main className="wrapper">
      <h2 className="fit-content">Create new post</h2>
      <CreatePost sendPost={sendPost} />
    </main>
  );
}

export default MePostsCreatePage;
