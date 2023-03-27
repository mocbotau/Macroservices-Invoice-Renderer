import { generateXML, readFileAsText, uploadFile } from "@src/utils";

beforeEach(() => {
  jest.clearAllMocks();
});

describe("uploadFile", () => {
  it("uploads files correctly", async () => {
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

describe("generateXML", () => {
  it("processes invoice items correctly", () => {
    expect(
      generateXML([
        { name: "apple", qty: 1, unitPrice: 0.5 },
        { name: "banana", qty: 2, unitPrice: 1 },
        { name: "peach", qty: 3, unitPrice: 2 },
      ]).replace(/>\n *</g, "><")
    ).toEqual(
      expect.stringContaining(
        "<ubl:InvoiceLine><cbc:ID>0</cbc:ID><cac:Item><cbc:Name>apple</cbc:Name></cac:Item><cbc:InvoicedQuantity>1</cbc:InvoicedQuantity><cac:Price><cbc:PriceAmount>0.5</cbc:PriceAmount></cac:Price><cbc:LineExtensionAmount>0.5</cbc:LineExtensionAmount></ubl:InvoiceLine><ubl:InvoiceLine><cbc:ID>1</cbc:ID><cac:Item><cbc:Name>banana</cbc:Name></cac:Item><cbc:InvoicedQuantity>2</cbc:InvoicedQuantity><cac:Price><cbc:PriceAmount>1</cbc:PriceAmount></cac:Price><cbc:LineExtensionAmount>2</cbc:LineExtensionAmount></ubl:InvoiceLine><ubl:InvoiceLine><cbc:ID>2</cbc:ID><cac:Item><cbc:Name>peach</cbc:Name></cac:Item><cbc:InvoicedQuantity>3</cbc:InvoicedQuantity><cac:Price><cbc:PriceAmount>2</cbc:PriceAmount></cac:Price><cbc:LineExtensionAmount>6</cbc:LineExtensionAmount></ubl:InvoiceLine>"
      )
    );
  });
});
