import { Router } from "express";
import { errCodes } from "../constants";
import { pgClient } from "../index";
import { setCookie } from "../utils/setCookie";

/*
  url: /me
  response: null | { errors?: FieldError[], user?: Object }
*/
const router = Router();

router.post("/", async (req, res) => {
  if (req.body.me) {
    setCookie(res, "me", req.body.me);
  } else {
    res.send(null);

    return;
  }

  type Obj = { [key: string]: string };

  const { id, password }: Obj = req.body.me;

  try {
    const response = await pgClient.query(
      "SELECT * FROM users WHERE id = $1 AND password = $2",
      [id, password]
    );

    const user = response.rows[0];
    res.json({ user });
  } catch (err) {
    if (err.code in errCodes) {
      errCodes[err.code](res, err);
    } else {
      console.log(err);
      res
        .status(500)
        .json({ errors: [{ field: "server", reason: "Internal error" }] });
    }
  }
});

export default router;
