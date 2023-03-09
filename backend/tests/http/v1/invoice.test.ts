import request from "supertest";
import app from "@src/app";

const API_KEY = "SENG2021-F14AMACROSERVICES";

describe("Invoice route", () => {
  test("Not authorised", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .send({ ubl: "123", language: "cn", style: 3 });
    expect(resp.statusCode).toBe(401);
  });

  test("No input body provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .set({ "api-key": API_KEY });
    expect(resp.statusCode).toBe(422);
  });

  test("Invalid language provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .send({ ubl: "123", language: "kr", style: 3 })
      .set({ "api-key": API_KEY });
    expect(resp.statusCode).toBe(400);
  });

  test("Invalid style provided", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .send({ ubl: "123", language: "cn", style: -1 })
      .set({ "api-key": API_KEY });
    expect(resp.statusCode).toBe(400);
  });

  test("It should return a PDF file", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .send({ ubl: "123", language: "cn", style: 3 })
      .set({ "api-key": API_KEY });

    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toBe("application/pdf");
    expect(resp.body).toBeDefined();
  });
});
