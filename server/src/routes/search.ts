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
    const postsResponse = await db.query(
      "SELECT * FROM posts WHERE title ILIKE $1 OR topic ILIKE $1",
      [query]
    );
    const usersResponse = await db.query(
      "SELECT * FROM users WHERE username ILIKE $1",
      [query]
    );

    res.json({
      data: { posts: postsResponse.rows, users: usersResponse.rows },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});
export default router;
