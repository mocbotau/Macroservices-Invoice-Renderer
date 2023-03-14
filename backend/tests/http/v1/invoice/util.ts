import request from "supertest";
import app from "@src/app";

let testKey: string | undefined = undefined;

export async function setupTestKey() {
  const resp = await request(app).get("/v1/generatekey");

  testKey = resp.body.key;
}

export function renderInvoiceRequestTest(route: "html" | "pdf" | "json") {
  if (testKey === undefined) {
    throw new Error(
      "testKey is undefined, perhaps forgot to call setupTestKey?"
    );
  }

  return request(app)
    .post("/v1/invoice/render/" + route)
    .set({ "api-key": testKey });
}
