import request from "supertest";
import app from "@src/app";
import { createHash } from "crypto";

export const TEST_API_KEY = "SENG2021-F14AMACROSERVICES";

// Set the API_KEY for testing
process.env.API_KEY = createHash("sha256").update(TEST_API_KEY).digest("hex");

export function renderInvoiceRequestTest(route: "html" | "pdf") {
  return request(app)
    .post("/v1/invoice/render/" + route)
    .set({ "api-key": TEST_API_KEY });
}
