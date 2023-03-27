import type { NextApiRequest, NextApiResponse } from "next";
import { DBRun, DBGet } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import * as EmailValidator from "email-validator";
import { withIronSessionApiRoute } from "iron-session/next";
import { IronOptions } from "@src/../iron_session.config";
import { getSession } from "@src/utils";

export default withIronSessionApiRoute(register_handler, IronOptions);

/**
 * This function attempts to register a user, creating a session.
 * This function will return:
 * 200 - When registration is successful
 * 405 - If any request is not a POST request
 * 400 - If the email is empty
 * 400 - If the password is empty
 * 400 - If the email is not a valid email
 * 409 - If the email  already exists
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export async function register_handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const body = req.body;
  if (!body.email || !body.password) {
    res.status(400).json({ error: "Email/Password can not be empty." });
    return;
  }
  if (!EmailValidator.validate(body.email)) {
    res.status(400).json({ error: "Email is not a valid form." });
    return;
  }
  const hashedPassword = createHash("sha256")
    .update(body.password)
    .digest("hex");
  const user = await DBGet("SELECT Email FROM Users WHERE Email = ?", [
    body.email,
  ]);
  if (user) {
    res.status(409).json({ error: "User already exists." });
  } else {
    await DBRun("INSERT INTO Users (Email, Password) VALUES (?,?)", [
      body.email,
      hashedPassword,
    ]);
    const session = getSession(req);
    session.user = {
      email: body.email,
    };
    await session.save();
    res.status(200).json({});
  }
}
