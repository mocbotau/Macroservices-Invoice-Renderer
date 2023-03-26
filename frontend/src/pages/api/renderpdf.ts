import { BackendApi } from "@src/BackendApi";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resp = await BackendApi.renderpdf(req.body);

  const arrayBuf = await (await resp.blob()).arrayBuffer();
  const arr = new Uint8Array(arrayBuf);
  const buffer = Buffer.from(arr);

  res.setHeader("Content-Type", resp.headers.get("content-type") as string);
  Readable.from(buffer).pipe(res);
}
