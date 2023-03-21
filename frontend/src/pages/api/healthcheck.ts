// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import { BackendApi } from "@src/BackendApi";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "GET") return res.status(405).json({});
  const status = await BackendApi.healthcheck();
  res.status(status).json({});
}
