import { Router } from "express";
import { setCookie } from "../utils/setCookie";

/* url: /me */
const router = Router();

router.get("/", (req, res) => {
  console.log("me cookies:", req.cookies);
  setCookie(res, "cookie", { hey: "hello world!" });
  res.send("hello");
});

export default router;
