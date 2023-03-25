import { logout_handler } from "@src/pages/api/auth/logout";
import { DBRun } from "@src/utils/DBHandler";
import { createHash } from "crypto";
import { mockRequest } from "./apiTestHelper";

beforeEach(() => {
  jest.clearAllMocks();
  DBRun("DELETE From Users");
});
describe("/auth/logout route", () => {
  test("It should provide a 405 bad method status when not GET", async () => {
    const resp = await mockRequest(logout_handler, {
      method: "POST",
      data: {},
    });
    expect(resp.statusCode).toBe(405);
  });
  // Not testing success case due to inability to create session
});
