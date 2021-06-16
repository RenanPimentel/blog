import { Response } from "express";
import { errCodes } from "../constants";

export function handleErr(res: Response, err: StrObj): void {
  if (err.code in errCodes) {
    errCodes[err.code](res, err);
    return;
  }
  console.log(err);
  res.status(400).json({
    errors: [{ reason: `Unknown error ${err.code}` }],
    data: null,
  } as MyResponse);
}
