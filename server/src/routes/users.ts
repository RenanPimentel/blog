import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";
/*
  /users
*/
const router = Router();

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const response = await db.query(
      "SELECT id, created_at, updated_at, last_login, username, email, avatar, banner FROM users WHERE id = $1",
      [user_id]
    );
    const user = response.rows[0];

    if (!user) {
      res.status(404).json({
        data: null,
        errors: [{ reason: "User not found" }],
      } as MyResponse);
      return;
    }

    res.json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.all("/:user_id/follow", async (req, res) => {
  const { user_id } = req.params;
  const { me } = req.cookies;

  if (user_id === me.id) {
    res.status(204).send();
    return;
  }

  try {
    const response = await db.query(
      "SELECT follower_id FROM follows WHERE followed_id = $1 AND follower_id = $2",
      [user_id, me.id]
    );

    if (response.rowCount === 0) {
      await db.query(
        "INSERT INTO follows (follower_id, followed_id) VALUES ($1, $2)",
        [me.id, user_id]
      );
    } else {
      await db.query(
        "DELETE FROM follows WHERE follower_id = $1 AND followed_id = $2",
        [me.id, user_id]
      );
    }

    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.get("/:user_id/followers/count", async (req, res) => {
  const { user_id } = req.params;
  const { me } = req.cookies;

  try {
    const countPromise = db.query(
      "SELECT COUNT(DISTINCT(follower_id)) FROM follows WHERE followed_id = $1",
      [user_id]
    );
    const userPromise = db.query(
      "SELECT follower_id FROM follows WHERE follower_id = $1 AND followed_id = $2",
      [me.id, user_id]
    );

    const [countResponse, followsResponse] = await Promise.all([
      countPromise,
      userPromise,
    ]);
    const { count } = countResponse.rows[0];

    res.json({
      data: { follows: followsResponse.rowCount !== 0, count },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
