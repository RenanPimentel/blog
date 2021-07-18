import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";

/*
  /comment
*/
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
    "SELECT author_id FROM comments WHERE id = $1",
    [comment_id]
  );
  const prevComment = commentResponse.rows[0];

  if (me.id !== prevComment.author_id) {
    res.status(401).json({
      data: null,
      errors: [{ reason: "you can't change this comment" }],
    } as MyResponse);
    return;
  }

  try {
    const response = await db.query(
      "UPDATE comments SET content = $1 WHERE id = $2 RETURNING *",
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
  const { me } = req.cookies;

  const commentResponse = await db.query(
    "SELECT author_id, post_author_id FROM comments WHERE id = $1",
    [comment_id]
  );
  const comment = commentResponse.rows[0];

  if (me.id !== comment.author_id && me.id !== comment.post_author_id) {
    res.status(401).json({
      data: null,
      errors: [{ reason: "you can't change this comment" }],
    } as MyResponse);
    return;
  }

  await db.query("DELETE FROM comments WHERE id = $1", [comment_id]);
  res.status(204).send();
});

router.put("/:comment_id/like", async (req, res) => {
  const { comment_id } = req.params;
  const { me } = req.cookies;

  try {
    const response = await db.query(
      "SELECT * FROM comment_likes WHERE user_id = $1 AND comment_id = $2",
      [me.id, comment_id]
    );

    if (response.rowCount === 0) {
      await db.query(
        "INSERT INTO comment_likes (comment_id, user_id) VALUES ($1, $2)",
        [comment_id, me.id]
      );
    } else {
      await db.query(
        "DELETE FROM comment_likes WHERE user_id = $1 AND comment_id = $2",
        [me.id, comment_id]
      );
    }

    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
