import express from "express";

import healthCheckRouter from "./healthcheck";
import invoiceRouter from "./invoice";
import generateKeyRouter from "./generatekey";

import { validateSession } from "@src/auth";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/generatekey", generateKeyRouter);

// protected routes
router.use("/invoice", validateSession, invoiceRouter);

export default router;
