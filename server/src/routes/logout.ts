import { Router } from "express";

const router = Router();

router.all("/", async (_, res) => {
  res.clearCookie("me");
  res.status(204).send();
});

export default router;
