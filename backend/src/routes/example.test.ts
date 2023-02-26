import request from "supertest";
import app from "../app";

describe("Example route", () => {
  test("It should provide a 200 OK status", async () => {
    const resp = await request(app).get("/example");

    expect(resp.statusCode).toBe(200);
  });
});
