import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";
import { validateName } from "../utils/validateName";

/*
  /me
*/
const router = Router();

router.get("/", async (req, res) => {
  const { me } = req.cookies;

  try {
    const response = await db.query(
      "SELECT * FROM users WHERE id = $1 AND password = $2",
      [me.id, me.password]
    );
    const user = response.rows[0];

    if (!user) {
      res.status(401).json({
        data: null,
        errors: [{ reason: "wrong cookie" }],
      } as MyResponse);
      return;
    }

    res.json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/change", async (req, res) => {
  const { avatar, banner, username } = req.body;
  const { me } = req.cookies;

  const nameError = validateName(username);

  if (nameError) {
    res.status(400).json({ data: null, errors: [nameError] } as MyResponse);
    return;
  }

  try {
    const response = await db.query(
      "UPDATE users SET avatar = $1, banner = $2, username = $3 WHERE id = $4 AND password = $5 RETURNING *",
      [avatar, banner, username, me.id, me.password]
    );
    const user = response.rows[0];

    if (!user) {
      res.status(401).json({
        data: null,
        errors: [{ reason: "wrong cookie" }],
      } as MyResponse);
      return;
    }

    res.json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/follows", async (req, res) => {
  const { me } = req.cookies;
  const followsResponse = await db.query(
    "SELECT followed_id FROM follows WHERE follower_id = $1",
    [me.id]
  );
  const queryInStr = `($${followsResponse.rows
    .map((_, i) => i + 1)
    .join(", $")})`;

  const postsResponse = await db.query(
    `SELECT * FROM posts WHERE author_id IN ${queryInStr} ORDER BY updated_at desc`,
    [...followsResponse.rows.map(row => Number(row.followed_id))]
  );
  const usersResponse = await db.query(
    `SELECT * FROM users WHERE id IN ${queryInStr} ORDER BY username`,
    [...followsResponse.rows.map(row => Number(row.followed_id))]
  );

  res.json({
    data: { posts: postsResponse.rows, users: usersResponse.rows },
    errors: null,
  } as MyResponse);
});

export default router;
