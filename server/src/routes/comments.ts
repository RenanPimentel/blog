import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";

const router = Router();

router.put("/:comment_id", async (req, res) => {
  const { comment_id } = req.params;
  const { comment: newComment } = req.body;
  const { me } = req.cookies;

  if (newComment.length <= 0) {
    res.status(400).json({
      data: null,
      errors: [{ reason: "missing comment content" }],
    } as MyResponse);
    return;
  }

  const commentResponse = await db.query(
    "SELECT * FROM comments WHERE id = $1",
    [comment_id]
  );
  const prevComment = commentResponse.rows[0];

  if (me.id !== prevComment.author_id) {
    res.status(404).json({
      errors: [{ reason: "you can't change this comment" }],
      data: null,
    } as MyResponse);
    return;
  }

  try {
    const response = await db.query(
      "UPDATE comments SET content = $1 WHERE id = $2",
      [newComment, comment_id]
    );

    res.json({
      data: { comment: response.rows[0] },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.delete("/:comment_id", async (req, res) => {
  const { comment_id } = req.params;
  const { comment: newComment } = req.body;
  const { me } = req.cookies;

  if (newComment.length <= 0) {
    res.status(400).json({
      data: null,
      errors: [{ reason: "missing comment content" }],
    } as MyResponse);
    return;
  }

  const commentResponse = await db.query(
    "SELECT * FROM comments WHERE id = $1",
    [comment_id]
  );
  const prevComment = commentResponse.rows[0];

  if (me.id !== prevComment.author_id) {
    res.status(401).json({
      errors: [{ reason: "you can't change this comment" }],
      data: null,
    } as MyResponse);
    return;
  }

  const postResponse = await db.query("SELECT * FROM posts WHERE id = $1", [
    prevComment.post_id,
  ]);

  if (postResponse.rowCount !== 1) {
    res.status(404).json({
      errors: [{ reason: "No post with this id" }],
      data: null,
    } as MyResponse);
    return;
  }
  const post = postResponse.rows[0];

  const userResponse = await db.query("SELECT * FROM users WHERE id = $1", [
    post.author_id,
  ]);

  const user = userResponse.rows[0];
  console.log({ user });
  console.log(req.cookies.me);
  try {
    const response =
      req.cookies.me.id === prevComment.author_id
        ? await db.query(
            "DELETE FROM comments WHERE id = $1 AND author_id = $2",
            [comment_id, prevComment.author_id]
          )
        : user.id === req.cookies.me.id
        ? await db.query("DELETE FROM comments WHERE id = $1", [comment_id])
        : null;
    console.log(response?.rows);
    res.json({
      data: { comment: response?.rows[0] },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
