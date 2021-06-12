import { Response } from "express";

export const production = process.env.NODE_ENV === "production";
export const errCodes = {
  "23505": (res: Response, err: { [key: string]: any }) => {
    const detail = (err.detail as string) || "";
    const startIndex = detail.split("").findIndex(c => c === "(");
    const lastIndex = detail.split("").findIndex(c => c === ")");
    const duplicateKey = detail.slice(startIndex + 1, lastIndex);
    res
      .status(400)
      .json({
        errors: [
          { field: duplicateKey, reason: `${duplicateKey} already exists` },
        ],
      });
  },
} as { [key: string]: (res: Response, err: { [key: string]: any }) => void };
