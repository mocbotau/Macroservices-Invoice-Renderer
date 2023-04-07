import "@tests/jest-setup";

import request from "supertest";
import app from "@src/app";

describe("Languages route", () => {
  test("It should provide a 200 OK status and language array", async () => {
    const resp = await request(app).get("/api/v3/invoice/languages");

    expect(resp.statusCode).toBe(200);
    expect(resp.body.languages instanceof Array).toBe(true);
  });
});
