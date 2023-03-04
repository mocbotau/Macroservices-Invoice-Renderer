import { ublToJSON } from "@src/util";

describe("Parsing UBL XML to JSON", () => {
  test("Given a valid UBL XML string, convert it to JSON", async () => {
    const ublString = `<?xml version="1.0" encoding="UTF-8" standalone="no"?>
                <Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns:cec="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
                    <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
                    <cbc:ID>EBWASP1002</cbc:ID>
                    <cbc:IssueDate>2022-02-07</cbc:IssueDate>
                </Invoice>`;

    expect(ublToJSON(ublString)).toMatchObject({
      "UBLVersionID": 2.1,
      "ID": "EBWASP1002",
      "IssueDate": "2022-02-07",
    });
  });
  test("Given an invalid UBL XML string, throw an error", async () => {
    const ublString = `<cbc:ID>EBWASP1002</cbc:ID>
            <cbc:IssueDate>2022-02-07</cbc:IssueDate>
            </Invoice>`;

    expect(() => {
      ublToJSON(ublString);
    }).toThrow(Error);
  });
});
