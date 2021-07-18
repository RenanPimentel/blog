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

  if (followsResponse.rows.length > 0) {
    //
    const postsResponse = await db.query(
      `SELECT * FROM (SELECT DISTINCT ON(posts.id) posts.id, author_id, title, username, avatar, content, topic, online, last_login, posts.updated_at FROM users RIGHT JOIN posts ON users.id = posts.author_id FULL JOIN post_views ON posts.id = post_id ORDER BY posts.id) as posts WHERE author_id IN ${queryInStr} ORDER BY updated_at DESC`,
      [...followsResponse.rows.map(row => Number(row.followed_id))]
    );
    const usersResponse = await db.query(
      `SELECT * FROM users WHERE id IN ${queryInStr} ORDER BY username`,
      [...followsResponse.rows.map(row => Number(row.followed_id))]
    );

    const query = postsResponse.rows.map((_, i) => i + 2).join(", $");
    const viewsResponse = await db.query(
      `SELECT post_id FROM post_views WHERE user_id = $1 AND post_id IN ($${query})`,
      [me.id, ...postsResponse.rows.map(row => row.id)]
    );
    const views = viewsResponse.rows.map(row => row.post_id);

    usersResponse.rows.map(row => delete row.password);

    const posts = postsResponse.rows.map(row => ({
      ...row,
      view: Boolean(views.find(view => view === row.id)),
    }));

    res.json({
      data: { posts, users: usersResponse.rows },
      errors: null,
    } as MyResponse);
  } else {
    res.json({ data: { posts: [], users: [] }, errors: null } as MyResponse);
  }
});

export default router;
