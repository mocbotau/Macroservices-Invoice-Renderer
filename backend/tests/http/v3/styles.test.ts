import "@tests/jest-setup";

import request from "supertest";
import app from "@src/app";

describe("Styles route", () => {
  test("It should provide a 200 OK status and styles array", async () => {
    const resp = await request(app).get("/api/v3/invoice/styles");

    expect(resp.statusCode).toBe(200);
    expect(resp.body.styles instanceof Array).toBe(true);
  });
});
