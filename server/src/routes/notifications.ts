import { Router } from "express";
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

  const response = await db.query(
    "SELECT id, content, type, created_at, sender_id, at_id FROM notifications JOIN notified_users ON id = notification_id WHERE notified_user_id = $1",
    [me.id]
  );

  res.json({
    data: { notifications: response.rows },
    errors: null,
  } as MyResponse);
});

router.post("/", async (req, res) => {
  const { me } = req.cookies;
  const { data, for: usersFor } = req.body;

  const response = await db.query(
    "INSERT INTO notifications (sender_id, at_id, content, type) VALUES ($1, $2, $3, $4) RETURNING *",
    [me.id, data.at, data.content, data.type]
  );

  const notification = response.rows[0];

  const promises = (usersFor as string[]).map((userId: string) =>
    db.query(
      "INSERT INTO notified_users (notified_user_id, notification_id) VALUES ($1, $2)",
      [userId, notification.id]
    )
  );

  await Promise.all(promises);
  res.status(204).send();
});
export default router;
