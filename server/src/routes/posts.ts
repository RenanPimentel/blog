import { Router } from "express";
import { handleErr } from "../utils/handleErr";
import { db } from "../index";
import { getReadTime } from "../utils/getReadTime";

const router = Router();

router.post("/", async (req, res) => {
  const { user_id, user_password, post }: PostsBody = req.body;

  try {
    const errors: FieldError[] = [];
    const passwordResponse = await db.query(
      "SELECT password FROM users WHERE id = $1",
      [user_id]
    );
    const userActualPassword = passwordResponse.rows[0].password;

    if (user_password !== userActualPassword) {
      errors.push({ field: "password", reason: "incorrect password" });
    }

    if (!post) {
      res.status(400).json({
        errors: [{ reason: "Must provide a post" }],
        data: null,
      } as MyResponse);
      return;
    }

    if (post.title.length < 5) {
      errors.push({
        field: "title",
        reason: "title must have at least 5 letters",
      });
    }

    if (post.content.length < 5) {
      errors.push({
        field: "content",
        reason: "content must have at least 5 letters",
      });
    }

    if (errors.length > 0) {
      res.status(400).json({ errors, data: null } as MyResponse);
      return;
    }

    const response = await db.query(
      "INSERT INTO posts (title, content, read_time, topic, author_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [post.title, post.content, getReadTime(post.content), post.topic, user_id]
    );

    res
      .status(201)
      .json({ data: { post: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/", async (req, res) => {
  try {
    if (req.cookies.me) {
      const response = await db.query(
        "SELECT * FROM posts WHERE author_id != $1 ORDER BY id LIMIT 10",
        [req.cookies.me?.id]
      );

      const posts = response.rows;
      res.json({ errors: null, data: { posts } } as MyResponse);
    } else {
      const response = await db.query(
        "SELECT * FROM posts ORDER BY id LIMIT 10"
      );

      const posts = response.rows;
      res.json({ errors: null, data: { posts } } as MyResponse);
    }
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;

  try {
    const response = await db.query("SELECT * FROM posts WHERE id = $1", [
      post_id,
    ]);

    const post = response.rows[0];
    res.json({ errors: null, data: { post } } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:post_id/comments", async (req, res) => {
  const { post_id } = req.params;

  try {
    const response = await db.query(
      "SELECT * FROM comments WHERE post_id = $1 ORDER BY id",
      [post_id]
    );

    res.json({ errors: null, data: { comments: response.rows } } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/:post_id/comments", async (req, res) => {
  const { post_id } = req.params;
  const { comment } = req.body;
  const { me } = req.cookies;

  if (comment.length <= 0) {
    res.status(400).json({
      data: null,
      errors: [{ reason: "missing comment" }],
    } as MyResponse);
    return;
  }

  try {
    const response = await db.query(
      "INSERT INTO comments (post_id, content, author_id) VALUES ($1, $2, $3) RETURNING *",
      [post_id, comment, me.id]
    );

    res.json({
      errors: null,
      data: { comment: response.rows[0] },
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.delete("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { id } = req.cookies.me;

  try {
    await db.query("DELETE FROM posts WHERE id = $1 AND author_id = $2", [
      post_id,
      id,
    ]);

    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.put("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { title, content, topic } = req.body;
  const { id, password } = req.cookies.me;

  if (!id || !password) {
    res.status(400).json({
      errors: [{ reason: "Missing user information" }],
      data: null,
    } as MyResponse);
    return;
  }

  const authorResponse = await db.query(
    "SELECT author_id FROM posts WHERE id = $1",
    [post_id]
  );

  const passwordResponse = await db.query(
    "SELECT password FROM users WHERE id = $1",
    [authorResponse.rows[0].author_id]
  );

  const userActualPassword = passwordResponse.rows[0].password;

  if (userActualPassword !== password) {
    res.status(400).json({
      errors: [{ reason: "You can't do this" }],
      data: null,
    } as MyResponse);
    return;
  }

  try {
    await db.query(
      "UPDATE posts SET title = $1, content = $2, topic = $3, read_time = $4 WHERE id = $5",
      [title, content, topic, getReadTime(content), post_id]
    );
    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await db.query(
      "SELECT * FROM posts WHERE author_id = $1 ORDER BY id",
      [user_id]
    );

    res.json({ data: { posts: response.rows }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
