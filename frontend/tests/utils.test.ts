import {
  checkBoundaries,
  convertToCellRefs,
  extractNumber,
  lettersToNumber,
  readFileAsText,
  uploadFile,
  generateXML,
} from "@src/utils";
import { DBRun } from "@src/utils/DBHandler";

beforeEach(async () => {
  jest.clearAllMocks();
  await DBRun("DELETE FROM Users");
});

describe("uploadFile", () => {
  it("wrong file gives error", async () => {
    const testFile = new File([], "test.txt");

    const createMock = jest.spyOn(document, "createElement").mockImplementation(
      (tagName) =>
        ({
          onchange: function (e: Event) {},
          click: function () {
            this.onchange({ target: { files: [testFile] } });
          },
        } as any)
    );

    const uploaded = await uploadFile(".csv");

    expect(createMock).toHaveBeenCalled();
    expect(uploaded).toEqual("Please upload a valid .csv file.");
  });

  it("uploads correctly", async () => {
    const testFile = new File([], "test.csv");

    const createMock = jest.spyOn(document, "createElement").mockImplementation(
      (tagName) =>
        ({
          onchange: function (e: Event) {},
          click: function () {
            this.onchange({ target: { files: [testFile] } });
          },
        } as any)
    );

    const uploaded = await uploadFile(".csv");

    expect(createMock).toHaveBeenCalled();
    expect(uploaded).toEqual(testFile);
  });
});

describe("readFileAsText", () => {
  it("uploads files correctly", async () => {
    const testFile = new File(["testdata"], "test.txt");

    const read = await readFileAsText(testFile);

    expect(read).toEqual("testdata");
  });
});

describe("lettersToNumber", () => {
  const tests = [
    ["A", 1],
    ["Z", 26],
    ["AA", 27],
    ["AB", 28],
    ["ZZ", 702],
    ["BKTXHSOGHKKE", 9007199254740991],
  ];
  test.each(tests)("given %p as argument, return %p", (arg, expectedResult) => {
    const result = lettersToNumber(arg as string);
    expect(result).toEqual(expectedResult);
  });
});

describe("convertToCellRefs", () => {
  test("invalid coordinates provided", () => {
    expect(convertToCellRefs(-1, 0, 0, 0)).toEqual("");
  });

  test("returns correctly", () => {
    expect(convertToCellRefs(0, 0, 1, 1)).toEqual("A1:B2");
  });
});

describe("checkBoundaries", () => {
  test("coordinates below 0 provided", () => {
    expect(checkBoundaries(-1, 3)).toEqual(0);
  });

  test("coordinates above max provided", () => {
    expect(checkBoundaries(3, 2)).toEqual(2);
  });

  test("returns the same value", () => {
    expect(checkBoundaries(2, 3)).toEqual(2);
  });
});

describe("extractNumber", () => {
  test("empty string returns 0", () => {
    expect(extractNumber("")).toEqual(0);
  });

  test("removed dollar sign and converted to number", () => {
    expect(extractNumber("$2.00")).toEqual(2);
  });

  test("string provided is not a number", () => {
    expect(extractNumber("owa")).toEqual(0);
  });

  test("returns the number", () => {
    expect(extractNumber("1")).toEqual(1);
  });
});

describe("generateXML", () => {
  it("processes invoice items correctly", () => {
    expect(
      generateXML(
        [
          { name: "Apple", qty: 1, unitPrice: 0.5 },
          { name: "Banana", qty: 2, unitPrice: 1 },
          { name: "Orange", qty: 3, unitPrice: 2 },
        ],
        {
          invoiceName: "Invoice 1",
          delivery: {
            name: "John Smith",
            address: {
              streetAddress: "42 Customer Rd",
              postcode: "2021",
            },
          },
        },
        {
          abn: "57195873179",
          address: {
            extraLine: "Room 1B",
            streetAddress: "3 Supplier St",
            suburb: "Randwick",
            state: "NSW",
            country: "AU",
          },
          name: "sendParty",
        },
        {
          abn: "53102443916",
          address: {
            streetAddress: "42 Customer Rd",
            postcode: "2021",
          },
          name: "custParty",
        }
      ).replace(/>\n *</g, "><")
    ).toEqual(
      expect.stringContaining(
        '<Invoice xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"><cbc:CustomizationID>urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:aunz:3.0</cbc:CustomizationID><cbc:ProfileID>urn:fdc:peppol.eu:2017:poacc:billing:01:1.0</cbc:ProfileID><cbc:ID>12345</cbc:ID><cbc:IssueDate>2023-03-31</cbc:IssueDate><cbc:DueDate>2023-04-14</cbc:DueDate><cbc:InvoiceTypeCode>380</cbc:InvoiceTypeCode><cbc:DocumentCurrencyCode>AUD</cbc:DocumentCurrencyCode><cbc:BuyerReference>Generic</cbc:BuyerReference><cac:AccountingSupplierParty><cac:Party><cbc:EndpointID schemeID="0151">57195873179</cbc:EndpointID><cac:PartyName><cbc:Name>sendParty</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>3 Supplier St</cbc:StreetName><cbc:AdditionalStreetName>Room 1B</cbc:AdditionalStreetName><cbc:CityName>Randwick</cbc:CityName><cbc:CountrySubentity>NSW</cbc:CountrySubentity><cac:Country><cbc:IdentificationCode>AU</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyLegalEntity><cbc:RegistrationName>sendParty</cbc:RegistrationName><cbc:CompanyID schemeID="0151">57195873179</cbc:CompanyID></cac:PartyLegalEntity></cac:Party></cac:AccountingSupplierParty><cac:AccountingCustomerParty><cac:Party><cbc:EndpointID schemeID="0151">53102443916</cbc:EndpointID><cac:PartyName><cbc:Name>custParty</cbc:Name></cac:PartyName><cac:PostalAddress><cbc:StreetName>42 Customer Rd</cbc:StreetName><cbc:PostalZone>2021</cbc:PostalZone><cac:Country><cbc:IdentificationCode>AU</cbc:IdentificationCode></cac:Country></cac:PostalAddress><cac:PartyLegalEntity><cbc:RegistrationName>custParty</cbc:RegistrationName><cbc:CompanyID schemeID="0151">53102443916</cbc:CompanyID></cac:PartyLegalEntity></cac:Party></cac:AccountingCustomerParty><cac:Delivery><cac:DeliveryLocation><cbc:StreetName>42 Customer Rd</cbc:StreetName><cbc:PostalZone>2021</cbc:PostalZone><cac:Country><cbc:IdentificationCode>AU</cbc:IdentificationCode></cac:Country></cac:DeliveryLocation><cac:DeliveryParty><cac:PartyName><cbc:Name>John Smith</cbc:Name></cac:PartyName></cac:DeliveryParty></cac:Delivery><cac:TaxTotal><cbc:TaxAmount currencyID="AUD">0.85</cbc:TaxAmount><cac:TaxSubtotal><cbc:TaxableAmount currencyID="AUD">8.5</cbc:TaxableAmount><cbc:TaxAmount currencyID="AUD">0.85</cbc:TaxAmount><cac:TaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>10</cbc:Percent><cac:TaxScheme><cbc:ID>GST</cbc:ID></cac:TaxScheme></cac:TaxCategory></cac:TaxSubtotal></cac:TaxTotal><cac:LegalMonetaryTotal><cbc:LineExtensionAmount currencyID="AUD">8.5</cbc:LineExtensionAmount><cbc:TaxExclusiveAmount currencyID="AUD">8.5</cbc:TaxExclusiveAmount><cbc:TaxInclusiveAmount currencyID="AUD">9.35</cbc:TaxInclusiveAmount><cbc:PayableAmount currencyID="AUD">9.35</cbc:PayableAmount></cac:LegalMonetaryTotal><cac:InvoiceLine><cbc:ID>0</cbc:ID><cbc:InvoicedQuantity unitCode="C62">1</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="AUD">0.5</cbc:LineExtensionAmount><cac:Item><cbc:Name>Apple</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>10</cbc:Percent><cac:TaxScheme><cbc:ID>GST</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="AUD">0.5</cbc:PriceAmount></cac:Price></cac:InvoiceLine><cac:InvoiceLine><cbc:ID>1</cbc:ID><cbc:InvoicedQuantity unitCode="C62">2</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="AUD">2</cbc:LineExtensionAmount><cac:Item><cbc:Name>Banana</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>10</cbc:Percent><cac:TaxScheme><cbc:ID>GST</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="AUD">1</cbc:PriceAmount></cac:Price></cac:InvoiceLine><cac:InvoiceLine><cbc:ID>2</cbc:ID><cbc:InvoicedQuantity unitCode="C62">3</cbc:InvoicedQuantity><cbc:LineExtensionAmount currencyID="AUD">6</cbc:LineExtensionAmount><cac:Item><cbc:Name>Orange</cbc:Name><cac:ClassifiedTaxCategory><cbc:ID>S</cbc:ID><cbc:Percent>10</cbc:Percent><cac:TaxScheme><cbc:ID>GST</cbc:ID></cac:TaxScheme></cac:ClassifiedTaxCategory></cac:Item><cac:Price><cbc:PriceAmount currencyID="AUD">2</cbc:PriceAmount></cac:Price></cac:InvoiceLine></Invoice>'
      )
    );
  });
});
