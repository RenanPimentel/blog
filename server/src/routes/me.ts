import { Router } from "express";
import { validateName } from "../utils/validateName";
import { errCodes } from "../constants";
import { db } from "../index";

const router = Router();

router.get("/", async (req, res) => {
  if (!req.cookies.me) {
    res.status(404).json({
      errors: [
        { reason: "Couldn't find your cookies, you may have to able them" },
      ],
      data: null,
    } as MyResponse);
    return;
  }

  const { id, password }: StrObj = req.cookies.me;

  try {
    const response = await db.query(
      "SELECT * FROM users WHERE id = $1 AND password = $2",
      [id, password]
    );
    const user = response.rows[0];

    res.json({ data: { user }, errors: null } as MyResponse);
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

router.post("/avatar", async (req, res) => {
  const { avatar } = req.body;
  try {
    const response = await db.query(
      "UPDATE users SET avatar = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [avatar, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
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

router.post("/banner", async (req, res) => {
  try {
    const response = await db.query(
      "UPDATE users SET banner = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [req.body.banner, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
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

router.post("/username", async (req, res) => {
  const { username } = req.body;
  try {
    const usernameError = validateName(username);

    if (usernameError) {
      res.status(400).json({ errors: [usernameError] } as MyResponse);
      return;
    }

    const response = await db.query(
      "UPDATE users SET username = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [username, req.cookies.me.id, req.cookies.me.password]
    );

    res.json({ data: { user: response.rows[0] }, errors: null } as MyResponse);
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
