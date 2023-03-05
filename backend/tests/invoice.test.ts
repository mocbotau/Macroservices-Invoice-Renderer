import request from "supertest";
import app from "@src/app";

describe("Invoice route", () => {
  test("It should return a PDF file", async () => {
    const resp = await request(app)
      .post("/v1/invoice/render")
      .attach("ubl", `${__dirname}/resources/example1.xml`);

    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toBe("application/pdf");
    expect(resp.body).toBeDefined();
  });
});
