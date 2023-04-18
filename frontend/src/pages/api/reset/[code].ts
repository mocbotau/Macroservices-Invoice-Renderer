import { PASSWORD_MIN_LENGTH } from "@src/constants";
import { DBGet, DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { NextApiRequest, NextApiResponse } from "next";

/**
 * This route will reset a users' password given a valid code
 * This route returns:
 * 405 - When the method is anything other than POST
 * 400 - When a code or password is not passed
 * 200 - On password reset success
 * @param {NextApiRequest} req - The request object
 * @param {NextApiResponse} res  -The response object
 * @returns {void}
 */
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
  if (body.password < PASSWORD_MIN_LENGTH) {
    res
      .status(400)
      .json({ error: "Password must be at least 6 characters long." });
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
  await DBRun("DELETE FROM ResetCodes WHERE Email = ?", [user.Email as string]);
  res.status(200).json({});
}
