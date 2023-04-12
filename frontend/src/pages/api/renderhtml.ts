import { BackendApi } from "@src/BackendApi";
import type { NextApiRequest, NextApiResponse } from "next";
import { Readable } from "stream";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const resp = await BackendApi.renderhtml(req.body);

  const arrayBuf = await (await resp.blob()).arrayBuffer();
  const arr = new Uint8Array(arrayBuf);
  const buffer = Buffer.from(arr);

  res.setHeader("Content-Type", resp.headers.get("content-type") as string);
  res.status(resp.status);
  Readable.from(buffer).pipe(res);
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: "5mb",
    },
  },
};
