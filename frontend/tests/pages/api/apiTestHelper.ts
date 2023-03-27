import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestOptions } from "node-mocks-http";

export const mockRequest = async (
  fn: (req: NextApiRequest, res: NextApiResponse) => Promise<void>,
  reqOptions?: RequestOptions
) => {
  const { req, res } = createMocks(reqOptions);
  await fn(req as unknown as NextApiRequest, res as unknown as NextApiResponse);
  return res;
};
