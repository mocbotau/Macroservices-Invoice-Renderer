import { Request, Response } from "express";
import "express-async-errors";

import generateInvoice from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  const result = await generateInvoice(req.body);

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
};
