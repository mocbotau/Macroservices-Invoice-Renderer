// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { fetchBackend } from "@src/util";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") res.status(405).json({});
  const resp = await fetchBackend("/api/v2/healthcheck", {
    method: "GET",
    mode: "cors",
  });
  res.status(resp.status).json(await resp.json());
}
