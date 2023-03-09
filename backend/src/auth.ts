import { createHash } from "crypto";
import { UnauthorisedError } from "./error";
import * as dotenv from "dotenv";
import { NextFunction, Request, Response } from "express";

dotenv.config();

/**
 * Given an API key, determine if the client has access
 * @param apiKey the API key to use with the API
 *
 * @throws {UnauthorisedError} if the API key is invalid
 */
export async function validateSession(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const apiKey = req.headers["api-key"] as string;
  if (
    apiKey === undefined ||
    createHash("sha256").update(apiKey).digest("hex") !== process.env.API_KEY
  ) {
    throw new UnauthorisedError();
  }
  next();
}
