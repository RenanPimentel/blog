import argon2 from "argon2";
import { Router } from "express";
import { db } from "../index";
import { setCookie } from "../utils/setCookie";
import { isEmail } from "../utils/isEmail";
import { handleErr } from "../utils/handleErr";

const router = Router();

router.post("/", async (req, res) => {
  const { login, password }: LoginBody = req.body;
  const errors: FieldError[] = [];
  const emailOrUsername = isEmail(login) ? "email" : "username";

  if (!login) {
    errors.push({ field: "login", reason: "Missing login" });
  }

  if (!password || password.length < 5) {
    errors.push({
      field: "password",
      reason: "Password must have at least 5 characters",
    });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors } as MyResponse);
    return;
  }

  try {
    const response = await db.query<{ id: string; password: string }>(
      `SELECT id, password FROM users WHERE ${emailOrUsername} = $1`,
      [login]
    );
    const user = response.rows[0];

    if (!user) {
      res.status(400).json({
        errors: [{ field: "login", reason: `User '${login}' not found` }],
      } as MyResponse);
      return;
    }

    const isRightPassword = await argon2.verify(user.password, password || "");

    if (!isRightPassword) {
      res.status(400).json({
        errors: [{ field: "password", reason: "Incorrect password" }],
      } as MyResponse);
      return;
    }

    setCookie(res, "me", user);

    await db.query("UPDATE users SET last_login = NOW() WHERE id= $1", [
      user.id,
    ]);

    res.status(200).json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
