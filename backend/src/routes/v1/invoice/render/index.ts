import express from "express";

import pdfRoute from "./pdf";
import jsonRoute from "./json";

const router = express.Router();

router.use("/pdf", pdfRoute);
router.use("/json", jsonRoute);

export default router;
