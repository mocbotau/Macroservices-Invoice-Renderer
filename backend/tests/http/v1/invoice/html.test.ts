import request from "supertest";
import path from "path";
import app from "@src/app";
import { readFile } from "fs/promises";
import { createHash } from "crypto";

const TEST_API_KEY = "SENG2021-F14AMACROSERVICES";

function renderInvoiceRequestTest() {
  return request(app)
    .post("/v1/invoice/render/html")
    .set({ "api-key": TEST_API_KEY });
}

beforeEach(() => {
  process.env.API_KEY = createHash("sha256").update(TEST_API_KEY).digest("hex");
});

describe("Invoice route", () => {
  test("No API key provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render/html")
      .send({ ubl: "123", language: "cn", style: 3 });
    expect(resp.statusCode).toBe(401);
  });

  test("Wrong API key provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render/html")
      .set({ "api-key": "thisisawrongapikey" })
      .send({ ubl: "123", language: "cn", style: 3 });
    expect(resp.statusCode).toBe(403);
  });

  test("No input body provided", async () => {
    const resp = await renderInvoiceRequestTest();
    expect(resp.statusCode).toBe(422);
  });

  test("Invalid language provided", async () => {
    const resp = await renderInvoiceRequestTest().send({
      ubl: "123",
      language: "kr",
      style: 3,
    });
    expect(resp.statusCode).toBe(400);
  });

  test("Invalid style provided", async () => {
    const resp = await renderInvoiceRequestTest().send({
      ubl: "123",
      language: "cn",
      style: -1,
    });
    expect(resp.statusCode).toBe(400);
  });

  test("It should return a HTML file", async () => {
    const resp = await renderInvoiceRequestTest().send({
      ubl: await readFile(
        path.join(__dirname, "../../../resources/example1.xml"),
        {
          encoding: "utf8",
        }
      ),
      language: "cn",
      style: 3,
    });

    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toBe("text/html");
    expect(resp.body).toBeDefined();
  });
});
