import { Router } from "express";
import { errCodes } from "../constants";
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
      "INSERT INTO posts (title, content, read_time, topic, user_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [post.title, post.content, getReadTime(post.content), post.topic, user_id]
    );

    res
      .status(201)
      .json({ data: { post: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
      return;
    }
    console.log(err);
    res.status(400).json({
      errors: [{ reason: `Unknown error ${err.code}` }],
      data: null,
    } as MyResponse);
  }
});

router.get("/users/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await db.query("SELECT * FROM posts WHERE user_id = $1", [
      user_id,
    ]);

    res.json({ data: { posts: response.rows }, errors: null } as MyResponse);
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
      return;
    }
    console.log(err);
    res.status(400).json({
      errors: [{ reason: `Unknown error ${err.code}` }],
      data: null,
    } as MyResponse);
  }
});

export default router;
