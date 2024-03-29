import { NextFunction, Request, Response } from "express";
import { db } from "./index";

export async function checkMe(req: Request, res: Response, next: NextFunction) {
  const { me } = req.cookies;

  if (!me) {
    res.status(401).json({
      data: null,
      errors: [{ reason: "You may have to able cookies" }],
    } as MyResponse);
    return;
  }

  const passwordResponse = await db.query(
    "SELECT password FROM users WHERE id = $1",
    [me.id]
  );
  const userActualPassword = passwordResponse.rows[0].password;

  if (userActualPassword !== me.password) {
    res.status(401).json({
      data: null,
      errors: [{ reason: "You may have to able cookies" }],
    } as MyResponse);
    return;
  }

  next();
}
