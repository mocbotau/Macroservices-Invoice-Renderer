import express from "express";

import healthCheckRouter from "./healthcheck";
import invoiceRouter from "./invoice";
import { validateSession } from "@src/auth";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);

// protected routes
router.use("/invoice", validateSession, invoiceRouter);

export default router;
