import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { IronOptions } from "@src/../iron_session.config";
import { getSession } from "@src/utils";

export default withIronSessionApiRoute(login_handler, IronOptions);

/**
 * This function attempts to log a user in, creating a session.
 * This function will return:
 * 200 - When login is successful
 * 405 - If any request is not a POST request
 * 404 - If the email does not exist
 * 403 - If the password is incorrect
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export async function login_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const body = req.body;
  const hashedPassword = createHash("sha256")
    .update(body.password)
    .digest("hex");
  const user = await DBGet(
    "SELECT Email, Password FROM Users WHERE Email = ?",
    [body.email]
  );
  if (!user) {
    res.status(404).json({ error: "User does not exist." });
  } else if (user && user.Password !== hashedPassword) {
    res.status(403).json({ error: "Password is incorrect." });
  } else {
    const session = getSession(req);
    session.user = {
      email: user.Email as string,
    };
    await session.save();
    res.status(200).json({});
  }
}
