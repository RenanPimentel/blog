/*
  url: /register
*/
import argon2 from "argon2";
import { Router } from "express";
import { setCookie } from "../utils/setCookie";
import { pgClient } from "../index";
import { validateEmail } from "../utils/validateEmail";
import { errCodes } from "../constants";

const router = Router();
type RegisterBody = { username?: string; email?: string; password?: string };
type FieldError = { field: "username" | "email" | "password"; reason: string };

router.route("/").post(async (req, res) => {
  const { username, email, password }: RegisterBody = req.body;

  const errors: FieldError[] = [];
  if (!username || username.length < 5) {
    errors.push({
      field: "username",
      reason: "Username must have at least 5 characters",
    });
  }
  if (!validateEmail(email)) {
    errors.push({ field: "email", reason: "Invalid email" });
  }
  if (!password || password.length < 5) {
    errors.push({
      field: "password",
      reason: "Password must have at least 5 characters",
    });
  }
  if (!/[a-z]|[A-Z]|[0-9]|_|-|\!|\?/.test(username || "abc")) {
    errors.push({
      field: "username",
      reason: "Invalid characters in username",
    });
  }

  if (errors.length > 0) {
    res.status(400).json({ errors });
    return;
  }

  try {
    const hashedPassword = await argon2.hash(password || "");
    const response = await pgClient.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING (id, password)",
      [username, email, hashedPassword]
    );

    const user = response.rows[0];

    setCookie(res, "me", user);
    res.status(200).json({ user });
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
    } else {
      res.status(500).json({ errors: ["Internal error"] });
    }
  }
});

export default router;
