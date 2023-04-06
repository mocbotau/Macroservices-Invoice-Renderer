import express from "express";

// v1 imports
import healthCheckRouter from "../v1/healthcheck";
import generateKeyRouter from "../v1/generatekey";

// v2 imports
import invoiceRouter from "./invoice";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);
router.use("/generatekey", generateKeyRouter);

// protected routes
router.use("/invoice", invoiceRouter);

export default router;
