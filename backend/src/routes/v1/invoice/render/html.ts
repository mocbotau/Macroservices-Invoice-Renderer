import { Request, Response } from "express";
import "express-async-errors";

import { generateInvoiceHTML } from "@src/react/invoice";

export default async (req: Request, res: Response) => {
  const stream = await generateInvoiceHTML(req.body);

  res.setHeader("Content-Type", "text/html");
  stream.pipe(res);
};
