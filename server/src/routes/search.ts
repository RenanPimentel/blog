import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";

/*
  /search
*/
const router = Router();

router.get("/", async (req, res) => {
  const query = `%${req.query.query}%`
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");

  try {
    const postsPromise = db.query(
      "SELECT title, posts.id, topic, content, username, author_id, posts.created_at, posts.updated_at FROM posts RIGHT JOIN users ON users.id = posts.author_id WHERE title ILIKE $1 OR topic ILIKE $1",
      [query]
    );
    const usersPromise = db.query(
      "SELECT * FROM users WHERE username ILIKE $1 ORDER BY last_login DESC",
      [query]
    );

    const [postsResponse, usersResponse] = await Promise.all([
      postsPromise,
      usersPromise,
    ]);

    usersResponse.rows.forEach(row => delete row.password);

    res.json({
      data: { posts: postsResponse.rows, users: usersResponse.rows },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});
export default router;
