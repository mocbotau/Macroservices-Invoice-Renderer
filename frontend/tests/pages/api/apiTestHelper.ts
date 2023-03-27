import { NextApiRequest, NextApiResponse } from "next";
import { createMocks, RequestOptions } from "node-mocks-http";
import { IronSessionData, IronSession } from "iron-session";

export const mockRequest = async (
  fn: Function,
  reqOptions?: RequestOptions
) => {
  const { req, res } = createMocks<NextApiRequest, NextApiResponse>(reqOptions);
  await fn(req, res);
  return res;
};
