import "@tests/jest-setup";

import path from "path";
import { readFile } from "fs/promises";
import { ublToJSON } from "@src/util";
import { renderInvoiceRequestTest, setupTestKey } from "../../util";

beforeAll(async () => {
  await setupTestKey();
});

describe("Invoice route v2", () => {
  test("It should return the JSON rendition of the ubl file", async () => {
    const ubl = await readFile(
      path.join(__dirname, "../../../resources/example1.xml"),
      {
        encoding: "utf8",
      }
    );

    const resp = await renderInvoiceRequestTest("v2", "json")
      .attach("file", path.join(__dirname, "../../../resources/example1.xml"))
      .field("language", "zh")
      .field("style", "3");

    expect(resp.statusCode).toBe(200);
    expect(resp.body).toStrictEqual(ublToJSON(ubl));
  });
});
