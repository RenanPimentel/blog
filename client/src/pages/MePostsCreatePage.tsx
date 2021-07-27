import React, { useContext, useEffect } from "react";
import { useHistory } from "react-router-dom";
import PostEdit from "../components/PostEdit";
import { MainContext } from "../context/context";
import { api } from "../util/api";

function MePostsCreatePage() {
  const { addMyPost, socket, me, setTitle } = useContext(MainContext);
  const history = useHistory();

  const sendPost = async (post: IPost) => {
    const response = await api.post<PostResponse>("/posts", { post: post });
    const { post: completePost } = response.data.data;
    addMyPost(completePost);

    const data = {
      for: [completePost.author_id],
      data: {
        type: "post",
        sender_id: me.id,
        content: completePost.title,
        at_id: me.id,
      },
    } as { data: INotification; for: string[] };

    const notificationsResponse = await api.post<NotificationResponse>(
      "/notifications",
      data
    );

    socket.emit("notification", {
      notification: notificationsResponse.data.data.notification,
      for: data.for,
    });
    api.post("/notifications", data);

    history.push(`/posts/${completePost.id}`);
  };

  useEffect(() => {
    setTitle(`Create Post • Three Dots`);
  }, [setTitle]);

  return (
    <main className="wrapper">
      <h2 className="fit-content">Create new post</h2>
      <PostEdit sendPost={sendPost} />
    </main>
  );
}

export default MePostsCreatePage;
