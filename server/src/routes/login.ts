/*
  url: /login
*/
import argon2 from "argon2";
import { Router } from "express";
import { validateEmail } from "../utils/validateEmail";
import { pgClient } from "../index";
import { errCodes } from "../constants";
import { setCookie } from "../utils/setCookie";

const router = Router();
type LoginBody = { login?: string; password?: string };
type FieldError = { field: "login" | "password"; reason: string };

router.route("/").post(async (req, res) => {
  const { login: usernameOrEmail, password }: LoginBody = req.body;
  const errors: FieldError[] = [];
  const field = validateEmail(usernameOrEmail) ? "email" : "username";

  if (!usernameOrEmail) {
    errors.push({ field: "login", reason: "Missing login" });
  } else if (!password || password.length < 5) {
    errors.push({
      field: "password",
      reason: "Password must have at least 5 characters",
    });
  }

  try {
    const response = await pgClient.query(
      `SELECT id, password FROM users WHERE (${field} = $1)`,
      [usernameOrEmail]
    );
    const user = response.rows[0];

    if (!user) {
      res.status(400).json({ errors: ["Invalid login"] });
      return;
    }
    const rightPassword = await argon2.verify(user.password, password || "");

    if (rightPassword) {
      setCookie(res, "me", user);
      res.status(200).json({ user });
    } else {
      res.status(400).json({ errors: ["Incorrect password"] });
    }
  } catch (err) {
    console.log(err);
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
    } else {
      res.status(500).json({ errors: ["Internal error"] });
    }
  }
});

export default router;
