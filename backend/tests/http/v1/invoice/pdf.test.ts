import "@tests/jest-setup";

import request from "supertest";
import path from "path";
import app from "@src/app";
import { readFile } from "fs/promises";

import { renderInvoiceRequestTest, setupTestKey } from "../../util";

beforeAll(async () => {
  await setupTestKey();
});

describe("Invoice route", () => {
  test("No API key provided", async () => {
    const resp = await request(app)
      .post("/api/v1/invoice/render/pdf")
      .send({ ubl: "123", language: "cn", style: "3" });
    expect(resp.statusCode).toBe(401);
  });

  test("Wrong API key provided", async () => {
    const resp = await request(app)
      .post("/api/v1/invoice/render/pdf")
      .set({ "api-key": "thisisawrongapikey" })
      .send({ ubl: "123", language: "cn", style: "3" });
    expect(resp.statusCode).toBe(403);
  });

  test("No input body provided", async () => {
    const resp = await renderInvoiceRequestTest("v1", "pdf");
    expect(resp.statusCode).toBe(422);
  });

  test("Invalid language provided", async () => {
    const resp = await renderInvoiceRequestTest("v1", "pdf").send({
      ubl: "123",
      language: "kr",
      style: "3",
    });
    expect(resp.statusCode).toBe(400);
  });

  test("Invalid style provided", async () => {
    const resp = await renderInvoiceRequestTest("v1", "pdf").send({
      ubl: "123",
      language: "zh",
      style: -1,
    });
    expect(resp.statusCode).toBe(400);
  });

  test("It should return a PDF file", async () => {
    const resp = await renderInvoiceRequestTest("v1", "pdf").send({
      ubl: await readFile(
        path.join(__dirname, "../../../resources/example1.xml"),
        {
          encoding: "utf8",
        }
      ),
      language: "zh",
      style: "3",
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toMatch(/^application\/pdf/);
    expect(resp.body).toBeDefined();
  });
});
