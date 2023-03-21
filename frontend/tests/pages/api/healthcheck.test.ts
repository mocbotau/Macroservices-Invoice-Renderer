import { BackendApi } from "@src/BackendApi";
import healthcheck from "@src/pages/api/healthcheck";
import { mockRequest } from "./apiTestHelper";

let healthSpy: jest.SpyInstance;

beforeEach(() => {
  healthSpy = jest
    .spyOn(BackendApi, "healthcheck")
    .mockImplementation(async () => {
      return 200;
    });
  jest.clearAllMocks();
});

describe("Healthcheck route", () => {
  test("It should provide a 200 OK status when the server is up", async () => {
    const resp = await mockRequest(healthcheck, { method: "GET" });
    expect(resp.statusCode).toBe(200);
    expect(healthSpy).toHaveBeenCalled();
  });
  test("It should provide a 503 unavailable status when the server is down", async () => {
    healthSpy = jest
      .spyOn(BackendApi, "healthcheck")
      .mockImplementation(async () => {
        return 503;
      });
    const resp = await mockRequest(healthcheck, { method: "GET" });
    expect(resp.statusCode).toBe(503);
    expect(healthSpy).toHaveBeenCalled();
  });
  test("It should provide a 405 bad method status when not GET", async () => {
    const resp = await mockRequest(healthcheck, { method: "POST" });
    expect(resp.statusCode).toBe(405);
    expect(healthSpy).not.toHaveBeenCalled();
  });
});
