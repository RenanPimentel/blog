import { Router } from "express";

/*
  url: /logout
*/
const router = Router();

router.route("/").get(async (_, res) => {
  res.clearCookie("me");
  res.json({ status: "success" });
});

export default router;
