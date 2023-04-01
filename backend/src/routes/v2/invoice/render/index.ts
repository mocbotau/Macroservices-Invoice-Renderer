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
    if (
      file.fieldname === "file" &&
      file.originalname.match(/(^[\w.]+)?\.xml$/)
    ) {
      cb(null, true);
    } else if (
      file.fieldname === "icon" &&
      file.originalname.match(/(^[\w.]+)?\.png$/)
    ) {
      cb(null, true);
    } else {
      cb(
        new InvalidUBL({
          message: `The provided file ${file.fieldname} was not of a valid type.`,
        })
      );
    }
  },
});

router.use(
  "/pdf",
  multerUpload.fields([
    { name: "file", maxCount: 1 },
    { name: "icon", maxCount: 1 },
  ]),
  async (req, res) => {
    req.files ||= {};
    const result = await generateInvoicePDF({
      ubl: req.get("Content-Type").includes("application/json")
        ? req.body.ubl
        : req.files["file"] && req.files["file"][0].buffer.toString(),
      language: req.body.language,
      style: req.body.style,
      optional: {
        ...req.body.optional,
        icon: req.files["icon"] && req.files["icon"][0].buffer,
      },
    });

    res.setHeader("Content-Type", "application/pdf");
    result.pipe(res);
  }
);

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
