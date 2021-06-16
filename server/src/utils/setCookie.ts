import { Response } from "express";
import { cookieOptions } from "../constants";

export function setCookie(res: Response, name: string, data: Object): void {
  res.cookie(name, data, cookieOptions);
}
