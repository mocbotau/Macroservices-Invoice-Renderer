import { Request, Response } from "express";
import express from "express";
import { createHash } from "crypto";

import { v4 as uuid } from "uuid";

import { dbRun } from "@src/database";

const router = express.Router();

router.get("/", async (req: Request, res: Response) => {
  const key = uuid().replace(/-/g, "");
  const hashedKey = createHash("sha256").update(key).digest("hex");

  await dbRun("INSERT INTO ApiKeys (key) VALUES (?)", hashedKey);

  res.json({ key });
});

export default router;
