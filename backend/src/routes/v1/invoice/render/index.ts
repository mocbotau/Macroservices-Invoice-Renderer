import express, { Request, Response } from "express";
import renderInvoiceToPDF from "@src/react/invoice";

const router = express.Router();

// TODO: This route is currently get for ease of testing but should later be post
router.get("/", async (req: Request, res: Response) => {
  // TODO: check for output type
  // TODO: parse UBL document
  // TODO: supply arguments to renderInvoiceToPDF
  const result = await renderInvoiceToPDF();

  res.setHeader("Content-Type", "application/pdf");

  result.pipe(res);
});

export default router;
