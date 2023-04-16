import { DBGet, DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const body = req.body;
  if (!body.password) {
    res.status(400).json({ error: "Code/Password can not be empty." });
    return;
  }
  const hashedPassword = createHash("sha256")
    .update(body.password)
    .digest("hex");
  const user = await DBGet("SELECT Email FROM ResetCodes WHERE Code = ?", [
    req.query.code as string,
  ]);
  if (!user) {
    return res.status(404).json({ error: "Code is invalid." });
  }
  await DBRun("UPDATE Users SET Password = ? WHERE Email = ?", [
    hashedPassword,
    user.Email as string,
  ]);
  await DBRun("DELETE FROM ResetCodes WHERE Code = ?", [
    req.query.code as string,
  ]);
  res.status(200).json({});
}
