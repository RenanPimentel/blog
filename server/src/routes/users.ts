import { Router } from "express";
import { db } from "../index";
import { handleErr } from "../utils/handleErr";

const router = Router();

router.get("/:user_id", async (req, res) => {
  const { user_id } = req.params;
  const { user_pass } = req.query;

  try {
    const response = user_pass
      ? await db.query(
          "SELECT id, created_at, updated_at, last_login, username, email, avatar, banner FROM users WHERE id = $1 AND password = $2",
          [user_id, decodeURI(String(user_pass))]
        )
      : await db.query(
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

export default router;
