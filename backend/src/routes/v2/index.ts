import express from "express";

// v1 imports
import healthCheckRouter from "../v1/healthcheck";
import generateKeyRouter from "../v1/generatekey";
import { validateSession } from "@src/auth";

// v2 imports
import invoiceRouter from "./invoice";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/generatekey", generateKeyRouter);

// protected routes
router.use("/invoice", validateSession, invoiceRouter);

export default router;
