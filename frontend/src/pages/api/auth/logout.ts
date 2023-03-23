import { withIronSessionApiRoute } from "iron-session/next";
import type { NextApiRequest, NextApiResponse } from "next";
import { IronOptions } from "@src/../iron_session.config";

export default withIronSessionApiRoute(logout_handler, IronOptions);

async function logout_handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "GET")
    return res.status(405).json({ error: "Only GET requests allowed" });
  await req.session.destroy();
  res.status(200).json({});
}
