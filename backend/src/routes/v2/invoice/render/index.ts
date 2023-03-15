import express from "express";
import multer from "multer";

import { InvalidUBL } from "@src/error";

import "express-async-errors";
import { generateInvoiceHTML, generateInvoicePDF } from "@src/react/invoice";
import { ublToJSON } from "@src/util";

const router = express.Router();
const multerUpload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    if (file.originalname.match(/(^[\w.]+)?\.xml$/)) {
      cb(null, true);
    } else {
      cb(
        new InvalidUBL({
          message: "The provided file was not of a valid type (.xml)",
        })
      );
    }
  },
});

router.use("/pdf", multerUpload.single("file"), async (req, res) => {
  const result = await generateInvoicePDF({
    ubl: req.get("Content-Type").includes("application/json")
      ? req.body.ubl
      : req.file?.buffer.toString(),
    language: req.body.language,
    style: req.body.style,
  });

  res.setHeader("Content-Type", "application/pdf");
  result.pipe(res);
});

router.use("/json", multerUpload.single("file"), async (req, res) => {
  if (
    (req.get("Content-Type").includes("application/json") && !req.body.ubl) ||
    (req.get("Content-Type").includes("multipart/form-data") && !req.file)
  ) {
    throw new InvalidUBL({ message: "No UBL file was provided." });
  }

  res.json(
    ublToJSON(
      req.get("Content-Type").includes("application/json")
        ? req.body.ubl
        : req.file?.buffer.toString()
    )
  );
});

router.use("/html", multerUpload.single("file"), async (req, res) => {
  const stream = await generateInvoiceHTML({
    ubl: req.get("Content-Type").includes("application/json")
      ? req.body.ubl
      : req.file?.buffer.toString(),
    language: req.body.language,
    style: req.body.style,
  });

  res.setHeader("Content-Type", "text/html");
  stream.pipe(res);
});

export default router;
