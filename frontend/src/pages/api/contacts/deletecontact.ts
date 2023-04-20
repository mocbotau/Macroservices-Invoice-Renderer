import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet, DBRun } from "@src/utils/DBHandler";

/**
 * This function will delete an existing contact from an account
 * This function will return:
 * 200 - When the operation is successful
 * 400 - If the ID is empty
 * 404 - If the ID could not be found
 * 405 - If any request is not a DELETE request
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export default async function delete_contact_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "DELETE")
    return res.status(405).json({ error: "Only DELETE requests allowed" });

  const params = req.query;

  if (!params || !params.id) {
    return res.status(400).json({ error: "No ID was provided." });
  }

  const prevRes = await DBGet("SELECT ID FROM ContactDetails WHERE ID = ?", [
    params.id as string,
  ]);

  if (!prevRes) {
    return res.status(404).json({ error: "This record was not found." });
  }

  await DBRun("DELETE FROM ContactDetails WHERE ID = ?", [params.id as string]);

  res.status(200).json({});
}
