import express from "express";

import pdfRoute from "./pdf";

const router = express.Router();

router.post("/", pdfRoute);

export default router;
