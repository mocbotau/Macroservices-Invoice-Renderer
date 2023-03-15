import "@tests/jest-setup";

import path from "path";
import { renderInvoiceRequestTest, setupTestKey } from "../../util";

beforeAll(async () => {
  await setupTestKey();
});

describe("Invoice route v2", () => {
  test("It should return a PDF file", async () => {
    const resp = await renderInvoiceRequestTest("v2", "pdf")
      .attach("file", path.join(__dirname, "../../../resources/example1.xml"))
      .field("language", "zh")
      .field("style", "3");

    expect(resp.statusCode).toBe(200);
    expect(resp.headers["content-type"]).toMatch(/^application\/pdf/);
    expect(resp.body).toBeDefined();
  });
});
