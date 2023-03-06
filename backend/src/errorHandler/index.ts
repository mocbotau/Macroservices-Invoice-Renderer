import { NextFunction, Request, Response } from "express";
import logger from "@src/logger";
import {
  InputError,
  InvalidLanguage,
  InvalidStyle,
  InvalidUBL,
} from "@src/error";

export const errorHandler = (
  err: InvalidUBL | InvalidLanguage | InvalidStyle | Error,
  req: Request,
  res: Response,
  // eslint-disable-next-line
  next: NextFunction
) => {
  if (err instanceof InputError) {
    logger.debug(err);
    res.status(err.statusCode).json({ message: err.message });
  } else {
    logger.error(err);
    res.status(500).json({ message: err.message });
  }
};
