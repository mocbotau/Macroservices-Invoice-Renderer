import { Request, Response } from "express";
import { readFile } from "fs/promises";

import renderInvoiceToPDF from "@src/react/invoice";
import { ublToJSON } from "@src/util";

export default async (req: Request, res: Response) => {
  const ublStr = await readFile(req.file.path, { encoding: "utf8" });
  const result = await renderInvoiceToPDF(ublToJSON(ublStr));

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
