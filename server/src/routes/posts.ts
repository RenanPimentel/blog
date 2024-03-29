import { Router } from "express";
import { db } from "../index";
import { getReadTime } from "../utils/getReadTime";
import { handleErr } from "../utils/handleErr";

/*
  /posts
*/
const router = Router();

router.get("/", async (_, res) => {
  try {
    const response = await db.query(
      "SELECT * FROM (SELECT DISTINCT ON(posts.id) posts.id, author_id, title, username, avatar, content, topic, online, last_login, posts.updated_at, posts.created_at FROM users RIGHT JOIN posts ON users.id = posts.author_id FULL JOIN post_views ON posts.id = post_id ORDER BY posts.id) as posts ORDER BY posts.updated_at DESC"
    );

    response.rows.forEach(row => delete row.password);

    res.json({
      data: { posts: response.rows },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/", async (req, res) => {
  const errors: FieldError[] = [];
  const { post }: PostsBody = req.body;
  const { me } = req.cookies;

  try {
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
      [
        post.title,
        post.content,
        getReadTime(post.content),
        Array.from(new Set(post.topic.split(" ").filter(Boolean))).join(" "),
        me.id,
      ]
    );

    res.json({ data: { post: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { me } = req.cookies;

  try {
    const response = await db.query("SELECT * FROM posts WHERE id = $1", [
      post_id,
    ]);

    if (response.rowCount !== 1) {
      res.status(404).json({
        errors: [{ reason: "Post not found" }],
        data: null,
      } as MyResponse);
      return;
    }

    const viewResponse = await db.query(
      "SELECT user_id FROM post_views WHERE user_id = $1 AND post_id = $2",
      [me.id, post_id]
    );

    if (viewResponse.rowCount === 0) {
      await db.query(
        "INSERT INTO post_views (user_id, post_id) VALUES ($1, $2)",
        [me.id, post_id]
      );
    }

    res.json({ errors: null, data: { post: response.rows[0] } } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:post_id/comments", async (req, res) => {
  const { post_id } = req.params;
  const { me } = req.cookies;

  try {
    const response = await db.query(
      "SELECT users.id as curr_user_id, username, avatar, comments.id, author_id, comments.created_at, comments.updated_at, content, post_id, post_author_id, COUNT(user_id) as like_count FROM comments LEFT JOIN comment_likes ON comments.id = comment_id LEFT JOIN users ON users.id = author_id WHERE post_id = $1 GROUP BY comments.id, users.id ORDER BY created_at DESC",
      [post_id]
    );

    const likesResponse = await db.query(
      "SELECT comment_id, user_id, post_id FROM comment_likes JOIN comments ON comment_id = id WHERE user_id = $1 AND post_id = $2",
      [me.id, post_id]
    );

    const comments = response.rows;
    comments.forEach(comment => {
      const index = likesResponse.rows.findIndex(
        lr => lr.comment_id === comment.id
      );

      if (index !== -1) {
        comment.likes = true;
        likesResponse.rows.splice(index, 1);
      } else {
        comment.likes = false;
      }
    });

    res.json({ errors: null, data: { comments } } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/:post_id/comments", async (req, res) => {
  const { comment, post_author_id } = req.body;
  const { post_id } = req.params;
  const { me } = req.cookies;

  if (!comment) {
    res.status(400).json({
      data: null,
      errors: [{ reason: "missing comment" }],
    } as MyResponse);
    return;
  }

  try {
    const response = await db.query(
      "INSERT INTO comments (post_id, content, author_id, post_author_id) VALUES ($1, $2, $3, $4) RETURNING *",
      [post_id, comment, me.id, post_author_id]
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
  const { me } = req.cookies;

  try {
    await db.query("DELETE FROM posts WHERE id = $1 AND author_id = $2", [
      post_id,
      me.id,
    ]);

    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.put("/:post_id", async (req, res) => {
  const { post_id } = req.params;
  const { title, content, topic } = req.body.post;
  const { me } = req.cookies;

  const postAuthorResponse = await db.query(
    "SELECT author_id FROM posts WHERE id = $1",
    [post_id]
  );

  const postAuthorPassResponse = await db.query(
    "SELECT password FROM users WHERE id = $1",
    [postAuthorResponse.rows[0].author_id]
  );

  const userActualPassword = postAuthorPassResponse.rows[0].password;

  if (userActualPassword !== me.password) {
    res.status(403).json({
      errors: [{ reason: "You can't do this" }],
      data: null,
    } as MyResponse);
    return;
  }

  try {
    await db.query(
      "UPDATE posts SET title = $1, content = $2, topic = $3, read_time = $4 WHERE id = $5",
      [
        title,
        content,
        Array.from(new Set(topic.split(" ").filter(Boolean))).join(" "),
        getReadTime(content),
        post_id,
      ]
    );
    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/by/:author_id", async (req, res) => {
  const { author_id } = req.params;

  try {
    const response = await db.query(
      "SELECT posts.id, title, content, topic, username, posts.created_at, posts.updated_at FROM posts RIGHT JOIN users ON posts.author_id = users.id WHERE author_id = $1",
      [author_id]
    );

    response.rows.forEach(row => delete row.password);

    res.json({ data: { posts: response.rows }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:post_id/likes/count", async (req, res) => {
  const { post_id } = req.params;

  const response = await db.query(
    "SELECT COUNT(DISTINCT(user_id)) FROM post_likes WHERE post_id = $1",
    [post_id]
  );

  const { count } = response.rows[0];

  res.json({ data: { count }, errors: null } as MyResponse);
});

router.get("/views/:post_id/count", async (req, res) => {
  const { post_id } = req.params;

  const response = await db.query(
    "SELECT COUNT(DISTINCT(user_id)) FROM post_views WHERE post_id = $1",
    [post_id]
  );

  const count = response.rows[0]?.count;

  if (count) {
    res.json({ data: { count }, errors: null } as MyResponse);
    return;
  }
});

router.get("/:post_id/likes", async (req, res) => {
  const { post_id } = req.params;

  const response = await db.query(
    "SELECT * FROM post_likes WHERE post_id = $1 AND user_id = $2",
    [post_id, req.cookies.me?.id]
  );

  const likes = response.rowCount === 1;

  res.json({ data: { likes }, errors: null } as MyResponse);
});

router.post("/:post_id/likes", async (req, res) => {
  const { post_id } = req.params;

  const postResponse = await db.query("SELECT id FROM posts WHERE id = $1", [
    post_id,
  ]);

  if (postResponse.rowCount !== 1) {
    res.status(404).json({
      errors: [{ reason: "Post not found" }],
      data: null,
    } as MyResponse);
    return;
  }

  await db.query("INSERT INTO post_likes (user_id, post_id) VALUES ($1, $2)", [
    req.cookies.me.id,
    post_id,
  ]);

  res.status(204).send();
});

router.delete("/:post_id/likes", async (req, res) => {
  const { post_id } = req.params;

  const postResponse = await db.query("SELECT id FROM posts WHERE id = $1", [
    post_id,
  ]);

  if (postResponse.rowCount !== 1) {
    res.status(404).json({
      errors: [{ reason: "Post not found" }],
      data: null,
    } as MyResponse);
    return;
  }

  await db.query("DELETE FROM post_likes WHERE user_id = $1 AND post_id = $2", [
    req.cookies.me.id,
    post_id,
  ]);

  res.status(204).send();
});

export default router;
