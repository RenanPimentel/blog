import argon2 from "argon2";
import { Router } from "express";
import { errCodes } from "../constants";
import { pgClient } from "../index";
import { setCookie } from "../utils/setCookie";
import { validateEmail } from "../utils/validateEmail";

/*
  url: /login
  response: { errors?: FieldError[], user?: Object }
*/
const router = Router();
type LoginBody = { login?: string; password?: string };
type FieldError = { field: "login" | "password"; reason: string };

router.route("/").post(async (req, res) => {
  const { login: usernameOrEmail, password }: LoginBody = req.body;
  const errors: FieldError[] = [];
  const field = validateEmail(usernameOrEmail) ? "email" : "username";

  if (!usernameOrEmail) {
    errors.push({ field: "login", reason: "Missing login" });
  }
  if (!password || password.length < 5) {
    errors.push({
      field: "password",
      reason: "Password must have at least 5 characters",
    });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const response = await pgClient.query(
      `SELECT id, password FROM users WHERE (${field} = $1)`,
      [usernameOrEmail]
    );
    const user = response.rows[0];

    if (!user) {
      res
        .status(400)
        .json({ errors: [{ field: "login", reason: "Invalid login" }] });
      return;
    }

    const rightPassword = await argon2.verify(user.password, password || "");
    if (rightPassword) {
      setCookie(res, "me", user);
      res.status(200).json({ user });
    } else {
      res.status(400).json({
        errors: [{ field: "password", reason: "Incorrect password" }],
      });
    }
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
    } else {
      console.log(err);
      res
        .status(500)
        .json({ errors: [{ field: "server", reason: "Internal error" }] });
    }
  }
});

export default router;
