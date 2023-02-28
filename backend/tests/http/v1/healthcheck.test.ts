import request from "supertest";
import app from "../../../src/app";

describe("Healthcheck route", () => {
  test("It should provide a 200 OK status", async () => {
    const resp = await request(app).get("/v1/healthcheck");

    expect(resp.statusCode).toBe(200);
  });
});
