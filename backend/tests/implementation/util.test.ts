import { formatCurrency, ublToJSON } from "@src/util";
import { readFile } from "fs/promises";
import testObject from "@tests/resources/example1.json";
import { InvalidUBL } from "@src/error";

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
    }).toThrow(InvalidUBL);
  });
  test("Given a UBL XML string with single 'always array' elements, they are converted to arrays", async () => {
    const ublString = `
      <Invoice>
        <cac:BillingReference>1</cac:BillingReference>
        <cac:AdditionalDocumentReference>1</cac:AdditionalDocumentReference>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cac:PartyIdentification>1</cac:PartyIdentification>
          </cac:Party>
        </cac:AccountingSupplierParty>
        <cac:PaymentMeans>1</cac:PaymentMeans>
        <cac:AllowanceCharge>1</cac:AllowanceCharge>
        <cac:TaxTotal>
          <cac:TaxSubtotal>1</cac:TaxSubtotal>
        </cac:TaxTotal>
        <cac:InvoiceLine>
          <cac:AllowanceCharge>1</cac:AllowanceCharge>
          <cac:Item>
            <cac:CommodityClassification>1</cac:CommodityClassification>
            <cac:AdditionalItemProperty>1</cac:AdditionalItemProperty>
          </cac:Item>
        </cac:InvoiceLine>
      </Invoice>
    `;
    expect(ublToJSON(ublString)).toMatchObject({
      BillingReference: [1],
      AdditionalDocumentReference: [1],
      AccountingSupplierParty: { Party: { PartyIdentification: [1] } },
      PaymentMeans: [1],
      AllowanceCharge: [1],
      TaxTotal: { TaxSubtotal: [1] },
      InvoiceLine: [
        {
          AllowanceCharge: [1],
          Item: {
            CommodityClassification: [1],
            AdditionalItemProperty: [1],
          },
        },
      ],
    });
  });
  test("Given a UBL XML string without 'always array' elements, they are not converted to arrays", async () => {
    const ublString = `
      <Invoice>
        <cac:InvoiceLine>
          <cac:Price>
            <cac:AllowanceCharge>1</cac:AllowanceCharge>
          </cac:Price>
        </cac:InvoiceLine>
      </Invoice>
    `;
    expect(ublToJSON(ublString)).toMatchObject({
      InvoiceLine: [
        {
          Price: { AllowanceCharge: 1 },
        },
      ],
    });
  });
  test("Given a UBL XML string with attributeless 'always text node' elements, they contain text nodes", async () => {
    const ublString = `
      <Invoice>
        <cac:AdditionalDocumentReference>
          <cbc:ID>1</cbc:ID>
        </cac:AdditionalDocumentReference>
        <cac:AccountingSupplierParty>
          <cac:Party>
            <cac:PartyIdentification>
              <cbc:ID>1</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyLegalEntity>
              <cbc:CompanyID>1</cbc:CompanyID>
            </cac:PartyLegalEntity>
          </cac:Party>
        </cac:AccountingSupplierParty>
      </Invoice>
    `;

    expect(ublToJSON(ublString)).toMatchObject({
      AdditionalDocumentReference: [
        {
          ID: { _text: 1 },
        },
      ],
      AccountingSupplierParty: {
        Party: {
          PartyIdentification: [{ ID: { _text: 1 } }],
        },
      },
    });
  });
  test("Given the example XML, it should produce the matching JSON object", async () => {
    const ublStr = await readFile(`${__dirname}/../resources/example1.xml`, {
      encoding: "utf8",
    });
    expect(ublToJSON(ublStr)).toStrictEqual(testObject);
  });
});

describe("Formatting currency amounts", () => {
  test("It should format a AUD amount with cents correctly", () => {
    expect(formatCurrency({ _text: 12.34, $currencyID: "AUD" })).toEqual(
      "$12.34"
    );
  });
  test("It should format a AUD amount without cents correctly", () => {
    expect(formatCurrency({ _text: 10.2, $currencyID: "AUD" })).toEqual(
      "$10.20"
    );
    expect(formatCurrency({ _text: 10, $currencyID: "AUD" })).toEqual("$10.00");
  });
  test("It should format a non-AUD amount correctly", () => {
    expect(formatCurrency({ _text: 10, $currencyID: "NZD" })).toEqual("$10.00");
  });
  test("It should format a negative amount correctly", () => {
    expect(formatCurrency({ _text: -10, $currencyID: "NZD" })).toEqual(
      "-$10.00"
    );
    expect(formatCurrency({ _text: -10, $currencyID: "AUD" })).toEqual(
      "-$10.00"
    );
  });
  test("It should format an unknown currency correctly", () => {
    expect(formatCurrency({ _text: 10, $currencyID: "XXX" })).toEqual(
      "10.00 XXX"
    );
  });
});
