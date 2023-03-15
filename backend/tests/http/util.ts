import request from "supertest";
import app from "@src/app";

let testKey: string | undefined = undefined;

export async function setupTestKey() {
  const resp = await request(app).get("/api/v1/generatekey");

  testKey = resp.body.key;
}

export function renderInvoiceRequestTest(
  apiVersion: "v1" | "v2",
  route: "html" | "pdf" | "json"
) {
  if (testKey === undefined) {
    throw new Error(
      "testKey is undefined, perhaps forgot to call setupTestKey?"
    );
  }

  return request(app)
    .post(`/api/${apiVersion}/invoice/render/` + route)
    .set({ "api-key": testKey });
}
