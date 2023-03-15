import "@tests/jest-setup";

import request from "supertest";
import path from "path";
import app from "@src/app";
import { readFile } from "fs/promises";
import { ublToJSON } from "@src/util";
import { renderInvoiceRequestTest, setupTestKey } from "../../util";

beforeAll(async () => {
  await setupTestKey();
});

describe("Invoice route", () => {
  test("No API key provided", async () => {
    const resp = await request(app)
      .post("/api/v1/invoice/render/json")
      .send({ ubl: "123" });
    expect(resp.statusCode).toBe(401);
  });

  test("Wrong API key provided", async () => {
    const resp = await request(app)
      .post("/api/v1/invoice/render/json")
      .set({ "api-key": "thisisawrongapikey" })
      .send({ ubl: "123" });
    expect(resp.statusCode).toBe(403);
  });

  test("No input body provided", async () => {
    const resp = await renderInvoiceRequestTest("v1", "json");
    expect(resp.statusCode).toBe(422);
  });

  test("Invalid UBL provided", async () => {
    const resp = await renderInvoiceRequestTest("v1", "json").send({
      ubl: "123",
    });
    expect(resp.statusCode).toBe(422);
  });

  test("It should return the JSON rendition of the ubl file", async () => {
    const ubl = await readFile(
      path.join(__dirname, "../../../resources/example1.xml"),
      {
        encoding: "utf8",
      }
    );

    const resp = await renderInvoiceRequestTest("v1", "json").send({
      ubl,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toStrictEqual(ublToJSON(ubl));
  });
});
