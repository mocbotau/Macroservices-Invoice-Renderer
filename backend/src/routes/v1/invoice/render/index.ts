import express from "express";
import multer from "multer";

import pdfRoute from "./pdf";

const router = express.Router();
const upload = multer({ storage: multer.diskStorage({}) });

router.post("/", upload.single("ubl"), pdfRoute);

export default router;
