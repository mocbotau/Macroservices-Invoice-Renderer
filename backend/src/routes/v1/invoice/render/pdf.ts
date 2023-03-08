import { Request, Response } from "express";
<<<<<<< HEAD
import { readFile } from "fs/promises";

import renderInvoiceToPDF from "@src/react/invoice";
import { ublToJSON } from "@src/util";

export default async (req: Request, res: Response) => {
  const ublStr = await readFile(req.file.path, { encoding: "utf8" });
  const result = await renderInvoiceToPDF(ublToJSON(ublStr));
=======
import "express-async-errors";

import generateInvoice from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  // TODO: parse UBL document
  const result = await generateInvoice(req.body);
>>>>>>> 4135a268859f8aafbfc9626c7bb1dd12ff95553d

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
