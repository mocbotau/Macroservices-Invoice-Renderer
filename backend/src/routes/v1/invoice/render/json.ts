import { Request, Response } from "express";
import "express-async-errors";

import { InvalidUBL } from "@src/error";
import { ublToJSON } from "@src/util";

export default async (req: Request, res: Response) => {
  if (!req.body.ubl) {
    throw new InvalidUBL({ message: "No UBL file was provided." });
  }

  res.json(ublToJSON(req.body.ubl));
};
