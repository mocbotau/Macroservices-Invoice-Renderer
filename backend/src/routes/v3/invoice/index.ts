import express from "express";

import renderRouter from "../../v2/invoice/render";

import { STYLES, SUPPORTED_LANGUAGES } from "../../../constants";
import { validateSession } from "@src/auth";

const router = express.Router();

router.use("/render", validateSession, renderRouter);

router.get("/styles", (_, res) => {
  res.json({ styles: STYLES.map((x, i) => ({ id: i, name: x })) });
});

router.get("/languages", (_, res) => {
  res.json({ languages: SUPPORTED_LANGUAGES });
});

export default router;
