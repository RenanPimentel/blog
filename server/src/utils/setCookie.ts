import { Response, CookieOptions } from "express";
import { production } from "../constants";

export function setCookie(res: Response, name: string, data: Object): void {
  const cookieOptions = {
    expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365),
    secure: production,
    sameSite: false,
    encode: (val: string) => {
      return val;
    },
  } as CookieOptions;

  res.cookie(name, data, cookieOptions);
}
