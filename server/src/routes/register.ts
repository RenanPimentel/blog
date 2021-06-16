import argon2 from "argon2";
import { Router } from "express";
import { validateName } from "../utils/validateName";
import { db } from "../index";
import { isEmail } from "../utils/isEmail";
import { handleErr } from "../utils/handleErr";

const router = Router();

router.post("/", async (req, res) => {
  const errors: FieldError[] = [];
  const { username, email, password }: RegisterBody = req.body;

  if (!username || username.length < 5) {
    errors.push({
      field: "username",
      reason: "Username must have at least 5 characters",
    });
  }

  if (!isEmail(email)) {
    errors.push({ field: "email", reason: "Invalid email" });
  }

  if (!password || password.length < 5) {
    errors.push({
      field: "password",
      reason: "Password must have at least 5 characters",
    });
  }

  const invalidUsername = validateName(username);

  if (invalidUsername) {
    errors.push(invalidUsername);
  }

  if (errors.length > 0) {
    res.status(400).json({ errors, data: null } as MyResponse);
    return;
  }

  try {
    const hashedPassword = await argon2.hash(password || "");
    const response = await db.query(
      "INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING id, password",
      [username, email, hashedPassword]
    );

    const user = response.rows[0];
    res.status(200).json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
