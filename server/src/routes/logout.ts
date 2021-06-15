import { Router } from "express";

/*
  url: /logout
*/
const router = Router();

router.route("/").get(async (_, res) => {
  res.clearCookie("me");
  res.status(201).json({});
});

export default router;
