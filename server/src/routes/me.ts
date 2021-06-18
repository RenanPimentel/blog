import { Router } from "express";
import { validateName } from "../utils/validateName";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";

const router = Router();

router.get("/", async (req, res) => {
  const { id }: StrObj = req.cookies.me;

  try {
    const response = await db.query("SELECT * FROM users WHERE id = $1", [id]);
    const user = response.rows[0];

    res.json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/avatar", async (req, res) => {
  const { avatar } = req.body;
  try {
    const response = await db.query(
      "UPDATE users SET avatar = $1 WHERE id = $2 RETURNING *",
      [avatar, req.cookies.me.id]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/banner", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE users SET banner = $1 WHERE id = $2 RETURNING *",
      [req.body.banner, req.cookies.me.id]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/username", async (req, res) => {
  const { username } = req.body;
  try {
    const usernameError = validateName(username);

    if (usernameError) {
      res.status(400).json({ errors: [usernameError] } as MyResponse);
      return;
    }

    const response = await db.query(
      "UPDATE users SET username = $1 WHERE id = $2 RETURNING *",
      [username, req.cookies.me.id]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
