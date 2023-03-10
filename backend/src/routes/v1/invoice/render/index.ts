import express from "express";

import pdfRoute from "./pdf";

const router = express.Router();

router.use("/pdf", pdfRoute);

export default router;
