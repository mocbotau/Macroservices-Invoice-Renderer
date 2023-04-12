import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { IronOptions } from "@src/../iron_session.config";
import { getSession } from "@src/utils";

export default withIronSessionApiRoute(logout_handler, IronOptions);

/**
 * This function attempts to log a user out, destroying a session.
 * This function will return:
 * 200 - When logout is successful
 * 405 - If any request is not a GET request
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export async function logout_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET requests allowed" });
  await getSession(req).destroy();
  res.status(200).json({});
}
