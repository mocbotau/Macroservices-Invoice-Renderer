import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet, DBRun } from "@src/utils/DBHandler";

/**
 * This function will edit an existing contact associated with an account, and if it doesn't exist,
 * creates the new record
 * This function will return:
 * 200 - When the operation is successful
 * 400 - If the ID is empty
 * 400 - If the name is empty
 * 400 - If the account is empty
 * 400 - If both the email and phone number is empty
 * 405 - If any request is not a PUT request
 * 409 - If the account and name combination already exists
 * @param {NextApiRequest} - The Next API request
 * @param {NextApiResponse} - The Next API response
 * @returns {void}
 */
export default async function edit_contact_handler(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });

  const body = req.body;

  if (!body.id) {
    return res.status(400).json({ error: "No ID provided." });
  }

  if (!body.account) {
    return res
      .status(400)
      .json({ error: "No account present. Please login first." });
  }

  if (!body.name) {
    return res.status(400).json({ error: "A name must be provided." });
  }

  if (!body.email && !body.phone) {
    return res.status(400).json({
      error: "Either an email or phone number (or both) must be provided.",
    });
  }

  let prevName = await DBGet("SELECT Name From ContactDetails WHERE ID = ?", [
    body.id,
  ]);

  if (!prevName) {
    prevName = await DBGet(
      "SELECT Name From ContactDetails WHERE Name = ? AND Account = ?",
      [body.name, body.account]
    );

    if (prevName) {
      return res.status(409).json({ error: "This contact already exists." });
    }

    await DBRun(
      "INSERT INTO ContactDetails (ID, Account, Name, EmailAddress, PhoneNumber) VALUES (?, ?,?,?,?)",
      [body.id, body.account, body.name, body.email, body.phone]
    );

    return res.status(200).json(body);
  }

  if (prevName["Name"] !== body.name) {
    const prevRes2 = await DBGet(
      "SELECT ID FROM ContactDetails WHERE Account = ? AND Name = ?",
      [body.account, body.name]
    );

    if (prevRes2) {
      return res.status(409).json({ error: "This contact already exists." });
    }
  }

  await DBRun(
    "UPDATE ContactDetails SET Name = ?, EmailAddress = ?, PhoneNumber = ? WHERE ID = ?",
    [body.name, body.email, body.phone, body.id]
  );

  res.status(200).json(body);
}
