import express from "express";

import pdfRoute from "./pdf";
import jsonRoute from "./json";
import htmlRoute from "./html";

const router = express.Router();

router.use("/pdf", pdfRoute);
router.use("/json", jsonRoute);
router.use("/html", htmlRoute);

export default router;
