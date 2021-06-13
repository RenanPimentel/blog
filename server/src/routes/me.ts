import { Router } from "express";
import { errCodes } from "../constants";
import { pgClient } from "../index";

/*
url: /me
response: null | { errors?: FieldError[], user?: Object }
*/
const router = Router();

type Obj = { [key: string]: string };

router.get("/", async (req, res) => {
  if (!req.cookies.me) {
    res.send(null);
    return;
  }
  const { id, password }: Obj = req.cookies.me;
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
