import type { NextApiRequest, NextApiResponse } from "next";
import { DBRun, DBGet } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import * as EmailValidator from "email-validator";
import { withIronSessionApiRoute } from "iron-session/next";
import { IronOptions } from "@src/../iron_session.config";

export default withIronSessionApiRoute(register_handler, IronOptions);

async function register_handler(req: NextApiRequest, res: NextApiResponse) {
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
    req.session.user = {
      email: body.email,
    };
    await req.session.save();
    res.status(200).json({});
  }
}
