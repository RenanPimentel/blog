import { Router } from "express";
import { validateName } from "../utils/validateName";
import { errCodes } from "../constants";
import { pgClient } from "../index";
import { getReadTime } from "../utils/getReadTime";

/*
  url: /posts
*/
const router = Router();

router.post("/", async (req, res) => {
  try {
    const passwordRes = await pgClient.query(
      "SELECT password FROM users WHERE id = $1",
      [req.body.user_id]
    );

    const errors: { field: string; reason: string }[] = [];

    if (req.body.user_password !== passwordRes.rows[0].password) {
      errors.push({ field: "user", reason: "user failed authentication" });
    }

    if (req.body.post.title.length < 5) {
      errors.push({
        field: "title",
        reason: "title must have at least 5 letters",
      });
    }

    if (req.body.post.content.length < 5) {
      errors.push({
        field: "content",
        reason: "content must have at least 5 letters",
      });
    }

    if (errors.length > 0) {
      return res.status(400).json({
        errors: { field: "user", reason: "user failed authentication" },
      });
    }

    const response = await pgClient.query(
      "INSERT INTO posts (title, content, read_time, topic, user_id) VALUES ($1, $2, $3, $4, $5)",
      [
        req.body.post.title,
        req.body.post.content,
        getReadTime(req.body.post.content),
        req.body.post.topic,
        req.body.user_id,
      ]
    );
    console.log(response);
    res.json({});
  } catch (err) {
    console.log(err);
    res.status(400).json({});
  }
});

router.get("/:user_id", async (req, res) => {
  try {
    const response = await pgClient.query(
      "SELECT * FROM posts WHERE user_id = $1",
      [req.params.user_id]
    );
    res.json({ posts: response.rows });
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
    } else {
      console.log(err);
      res
        .status(500)
        .json({ errors: [{ field: "server", reason: "Internal error" }] });
    }
  }
});

router.post("/avatar", async (req, res) => {
  try {
    const response = await pgClient.query(
      "UPDATE users SET avatar = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [req.body.avatar, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ user: response.rows[0] });
  } catch (e) {
    res
      .status(500)
      .json({ errors: [{ field: "server", reason: "Internal error" }] });
  }
});

router.post("/banner", async (req, res) => {
  try {
    const response = await pgClient.query(
      "UPDATE users SET banner = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [req.body.banner, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ user: response.rows[0] });
  } catch (e) {
    res
      .status(500)
      .json({ errors: [{ field: "server", reason: "Internal error" }] });
  }
});

router.post("/username", async (req, res) => {
  try {
    const usernameError = validateName(req.body.username);

    if (usernameError) {
      res.status(400).json({ errors: [usernameError] });
      return;
    }

    const response = await pgClient.query(
      "UPDATE users SET username = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [req.body.username, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ user: response.rows[0] });
  } catch (e) {
    res.status(500).json({
      errors: [{ field: "server", reason: "Username already in use" }],
    });
  }
});

export default router;
