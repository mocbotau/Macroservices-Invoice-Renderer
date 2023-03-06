import express, { NextFunction, Request, Response } from "express";

import healthCheckRouter from "./healthcheck";
import invoiceRouter from "./invoice";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/invoice", invoiceRouter);

export default router;
