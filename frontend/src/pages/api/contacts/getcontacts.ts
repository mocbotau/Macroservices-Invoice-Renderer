import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet } from "@src/utils/DBHandler";

/**
 * This function will fetch all contacts associated with an account
 * This function will return:
 * 200 - When the operation is successful
 * 400 - If no account is provided
 * 405 - If any request is not a GET request
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export default async function get_contacts_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET requests allowed" });

  const params = req.query;

  if (!params || !params.account) {
    return res
      .status(400)
      .json({ error: "No account present. Please login first." });
  }

  const result = await DBGet(
    "SELECT ID, Name, EmailAddress, PhoneNumber FROM ContactDetails WHERE Account = ?",
    [params.account as string]
  );

  res.status(200).json(result || null);
}
