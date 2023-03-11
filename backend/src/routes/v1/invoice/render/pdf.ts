import { Request, Response } from "express";
import "express-async-errors";

import { generateInvoicePDF } from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  const result = await generateInvoicePDF(req.body);

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
