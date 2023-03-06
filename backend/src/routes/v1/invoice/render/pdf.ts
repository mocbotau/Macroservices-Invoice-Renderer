import { Request, Response } from "express";
import "express-async-errors";

import renderInvoiceToPDF from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  // TODO: parse UBL document
  const result = await renderInvoiceToPDF(req.body);

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
