import cors from "cors";
import { CookieOptions, Response } from "express";
import { NODE_ENV } from "./config";

export const production = NODE_ENV === "production";

export const errCodes = {
  23505: (res, err) => {
    const detail = String(err.detail) || "";
    const startIndex = detail.split("").findIndex(c => c === "(");
    const lastIndex = detail.split("").findIndex(c => c === ")");
    const duplicateKey = detail.slice(startIndex + 1, lastIndex);

    const errors = [
      { field: duplicateKey, reason: `${duplicateKey} already exists` },
    ];

    res.status(400).json({ errors, data: null } as MyResponse);
  },
  22001: res => {
    res
      .status(400)
      .json({ errors: [{ reason: "Value too long" }] } as MyResponse);
  },
} as { [key: string]: (res: Response, err: { [key: string]: any }) => void };

export const corsOptions = {
  origin: "http://localhost:3000",
  optionsSuccessStatus: 200,
  credentials: true,
} as cors.CorsOptions;

export const cookieOptions = {
  expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 30),
  secure: production,
  sameSite: false,
  encode: (val: string) => {
    return val;
  },
  httpOnly: true,
  path: "/",
} as CookieOptions;
