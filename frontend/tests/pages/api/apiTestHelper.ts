import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestOptions } from "node-mocks-http";

export const mockRequest = async (
  fn: Function,
  reqOptions?: RequestOptions
) => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>(reqOptions);
  await fn(req, res);
  return res;
};
