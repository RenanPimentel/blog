import argon2 from "argon2";
import { Router } from "express";
import { CLIENT_URL } from "../config";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";
import { isEmail } from "../utils/isEmail";
import { sendEmail } from "../utils/sendEmail";
import { setCookie } from "../utils/setCookie";
import { validateName } from "../utils/validateName";

const router = Router();

router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
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

router.all("/logout", async (_, res) => {
  res.clearCookie("me");
  res.status(204).send();
});

router.post("/forgot", async (req, res) => {
  res.clearCookie("me");

  const response = await db.query(
    "SELECT id, password, username FROM users WHERE email = $1",
    [req.body.email]
  );
  const user = response.rows[0];

  if (!user) {
    res.status(400).json({
      errors: [{ reason: "Email not registered", field: "email" }],
      data: null,
    } as MyResponse);
    return;
  }
  const href =
    `${CLIENT_URL}/resetpass` +
    `?user_id=${encodeURI(user.id)}&user_pass=${encodeURI(user.password)}`;

  const emailRes = await sendEmail(
    req.body.email,
    "password",
    `<!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body>
        <a href="${href}" class="link">
          Click here to reset your password
        </a>
      </body>
    </html>
    `
  );

  res.send({
    data: { emailRes, username: user.username },
    errors: null,
  } as MyResponse);
});

router.post("/password", async (req, res) => {
  const { password } = req.body;

  if (password?.length < 5) {
    res.status(400).json({
      errors: [
        {
          reason: "Password must contain at least 5 letters",
          field: "password",
        },
      ],
      data: null,
    } as MyResponse);
    return;
  }

  const hPassword = await argon2.hash(password);
  const { user_id, user_pass } = req.query;

  try {
    const response = await db.query(
      "UPDATE users SET password = $1 WHERE id = $2 AND password = $3 RETURNING *",
      [hPassword, decodeURI(String(user_id)), decodeURI(String(user_pass))]
    );
    const user = response.rows[0];

    if (!user) {
      res
        .status(400)
        .json({ data: null, errors: [{ reason: "Wrong url" }] } as MyResponse);
      return;
    }

    res.json({ data: { user }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
