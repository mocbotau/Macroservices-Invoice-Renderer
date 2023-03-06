import { NextFunction, Request, Response } from "express";
import logger from "@src/logger";
import {
  InputError,
  InvalidLanguage,
  InvalidStyle,
  InvalidUBL,
} from "@src/error";

/* eslint-disable */
export const errorHandler = (
  err: InvalidUBL | InvalidLanguage | InvalidStyle | Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  /* eslint-enable */
  if (err instanceof InputError) {
    logger.debug(err);
    KnownErrorResponder(err, req, res);
  } else {
    logger.error(err);
    unknownErrorResponder(err as Error, req, res);
  }
};

const unknownErrorResponder = (err: Error, req: Request, res: Response) => {
  res.status(500).json({ message: err.message });
};

const KnownErrorResponder = (
  err: InvalidUBL | InvalidLanguage | InvalidStyle,
  req: Request,
  res: Response
) => {
  res.status(err.statusCode).json({ message: err.message });
};
