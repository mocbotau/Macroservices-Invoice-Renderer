import express from "express";

import renderRouter from "./render";

const router = express.Router();

router.use("/render", renderRouter);

export default router;
