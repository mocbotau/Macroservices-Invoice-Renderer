import express from "express";

import healthCheckRouter from "./healthcheck";

const router = express.Router();

router.use("/healthcheck", healthCheckRouter);

export default router;
