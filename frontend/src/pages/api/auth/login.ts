import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { DBGet } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { IronOptions } from "@src/../iron_session.config";
import { IronSessionData } from "iron-session";

export default withIronSessionApiRoute(login_handler, IronOptions);

async function login_handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Only POST requests allowed" });
  const body = req.body;
  const hashedPassword = createHash("sha256")
    .update(body.password)
    .digest("hex");
  const user = await DBGet(
    "SELECT Email, Password FROM Users WHERE Email = ?",
    body.email
  );
  if (!user) {
    res.status(404).json({ error: "User does not exist." });
  } else if (user && user.Password !== hashedPassword) {
    res.status(403).json({ error: "Password is incorrect." });
  } else {
    (req.session as IronSessionData).user = {
      email: user.Email as string,
    };
    await req.session.save();
    res.status(200).json({});
  }
}
