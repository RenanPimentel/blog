import { Router } from "express";
import { handleErr } from "../utils/handleErr";
import { db } from "../index";

/*
  /notifications
*/
const router = Router();

router.get("/", async (req, res) => {
  const { me } = req.cookies;

  if (!me.id) {
    res.json({
      data: null,
      errors: [{ reason: "cookie not allowed" }],
    } as MyResponse);
  }

  try {
    const response = await db.query(
      "SELECT id, content, type, created_at, sender_id, at_id FROM notifications JOIN notified_users ON id = notification_id WHERE notified_user_id = $1 ORDER BY created_at DESC",
      [me.id]
    );

    res.json({
      data: { notifications: response.rows },
      errors: null,
    } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.post("/", async (req, res) => {
  const { me } = req.cookies;
  const { data, for: usersFor } = req.body;

  try {
    const response = await db.query(
      "INSERT INTO notifications (sender_id, at_id, content, type) VALUES ($1, $2, $3, $4) RETURNING *",
      [me.id, data.at_id, data.content, data.type]
    );

    const notification = response.rows[0];

    const promises = (usersFor as string[]).map((userId: string) =>
      db.query(
        "INSERT INTO notified_users (notified_user_id, notification_id) VALUES ($1, $2)",
        [userId, notification.id]
      )
    );

    await Promise.all(promises);
    res.json({ data: { notification }, errors: null } as MyResponse);
  } catch (err) {
    handleErr(res, err);
  }
});

router.delete("/", async (req, res) => {
  const { me } = req.cookies;

  try {
    await db.query("DELETE FROM notified_users WHERE notified_user_id = $1", [
      me.id,
    ]);
    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

router.delete("/:notification_id", async (req, res) => {
  const { me } = req.cookies;
  const { notification_id } = req.params;

  try {
    await db.query(
      "DELETE FROM notified_users WHERE notified_user_id = $1 AND notification_id = $2",
      [me.id, notification_id]
    );
    res.status(204).send();
  } catch (err) {
    handleErr(res, err);
  }
});

export default router;
