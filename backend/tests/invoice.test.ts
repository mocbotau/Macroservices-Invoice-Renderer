import request from "supertest";
import app from "@src/app";
import testObject from "@tests/resources/example1.json";
import { readFile } from "fs/promises";

describe("Invoice route", () => {
  test("No input body provided", async () => {
    const resp = await request(app).post("/v1/invoice/render/pdf");
    expect(resp.statusCode).toBe(422);
  });

  test("Invalid language provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render/pdf")
      .send({ ubl: "123", language: "kr", style: 3 });
    expect(resp.statusCode).toBe(400);
  });

  test("Invalid style provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render/pdf")
      .send({ ubl: "123", language: "cn", style: -1 });
    expect(resp.statusCode).toBe(400);
  });

  test("It should return a PDF file", async () => {
    const ublStr = await readFile(`${__dirname}/resources/example1.xml`, {
      encoding: "utf8",
    });
    const resp = await request(app)
      .post("/v1/invoice/render/pdf")
      .send({ ubl: ublStr, language: "cn", style: 3 });
    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toBe("application/pdf");
    expect(resp.body).toBeDefined();
  });
});
