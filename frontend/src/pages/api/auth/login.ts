import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { Session } from "@src/interfaces";

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
export default async function login_handler(
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
    "SELECT Identifier, Password, Name FROM Users WHERE Identifier = ?",
    [body.email]
  );
  if (!user) {
    res.status(404).json({ error: "User does not exist." });
  } else if (user && user.Password !== hashedPassword) {
    res.status(403).json({ error: "Password is incorrect." });
  } else {
    const session: Session = {
      email: user.Identifier as string,
      name: user.Name as string,
    };
    res.status(200).json({ user: session });
  }
}
