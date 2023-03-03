import { Request, Response } from "express";

import renderInvoiceToPDF from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  // TODO: parse UBL document
  // TODO: supply arguments to renderInvoiceToPDF
  const result = await renderInvoiceToPDF();

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
