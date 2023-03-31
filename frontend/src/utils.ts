import {
  InvoiceItem,
  InvoiceMetadata,
  InvoiceParty,
  InvoiceAddress,
} from "./interfaces";
import xml from "xml";
import { NextApiRequest } from "next";
import { ABN_ID, DEF_UNIT, GST_RATE, INVOICE_CODE } from "./constants";

/**
 * Prompts the user to upload a file
 *
 * @param {string} fileType - file type to upload (eg ".csv")
 * @returns {Promise<File>} - uploaded file
 */
export async function uploadFile(fileType: string): Promise<File> {
  return new Promise((res) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = fileType;

    input.onchange = (e) => {
      if (!e || !e.target) {
        return;
      }
      const target = e.target as HTMLInputElement;
      if (!target.files) {
        return;
      }
      const file = target.files[0];

      res(file);
    };

    input.click();
  });
}

/**
 * Reads a file to text
 *
 * @param {File} file - file to read
 * @returns {Promise<string>} - string that is read
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      if (!evt.target) return;
      if (evt.target.readyState !== 2) return;
      if (evt.target.error) {
        rej(evt.target.error);
        return;
      }

      res(evt.target.result as string);
    };

    reader.readAsText(file);
  });
}

/**
 * Takes potentially sparse, structured data and converts it into a UBL compliant
 * XML string. Missing compulsory data is filled by reasonable defaults.
 *
 * @param {InvoiceItem[]} items - a list of items to include
 * @param {InvoiceMetadata} meta - invoice-level metadata to include
 * @param {InvoiceParty} supplier - details about the party supplying the goods/service
 * @param {InvoiceParty} customer - details about the party receiving the goods/service
 * @returns {string} - an XML string with the supplied data
 */
export function generateXML(
  items: InvoiceItem[],
  meta: InvoiceMetadata,
  supplier: InvoiceParty,
  customer: InvoiceParty
) {
  const formatDate = (date: Date) =>
    `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(
      2,
      "0"
    )}-${String(date.getDate()).padStart(2, "0")}`;

  meta.currencyCode ||= "AUD";
  const today = new Date();
  const defaultDue = new Date();
  defaultDue.setDate(today.getDate() + 14);
  meta.issueDate ||= formatDate(today);
  meta.dueDate ||= formatDate(defaultDue);
  meta.reference ||= "Generic";
  if (meta.delivery) meta.delivery.address.country ||= "AU";
  supplier.address.country ||= "AU";
  customer.address.country ||= "AU";

  const formatCurrency = (amt: number) => [
    amt,
    { "_attr": { "currencyID": meta.currencyCode } },
  ];

  const formatABN = (abn: string) => [abn, { "_attr": { "schemeID": ABN_ID } }];

  const formatAddress = (address?: InvoiceAddress) =>
    address
      ? [
          { "cbc:StreetName": address.streetAddress },
          { "cbc:AdditionalStreetName": address.extraLine },
          { "cbc:CityName": address.suburb },
          { "cbc:PostalZone": address.postcode },
          { "cbc:CountrySubentity": address.state },
          { "cac:Country": [{ "cbc:IdentificationCode": address.country }] },
        ]
      : {};

  const formatParty = (party?: InvoiceParty) =>
    party
      ? [
          {
            "cac:Party": [
              { "cbc:EndpointID": formatABN(party.abn) },
              { "cac:PartyName": [{ "cbc:Name": party.name }] },
              { "cac:PostalAddress": formatAddress(party.address) },
              {
                "cac:PartyLegalEntity": [
                  { "cbc:RegistrationName": party.name },
                  { "cbc:CompanyID": formatABN(party.abn) },
                ],
              },
              {
                "cac:Contact": [
                  { "cbc:Name": party.contactName },
                  { "cbc:Telephone": party.contactPhone },
                  { "cbc:ElectronicMail": party.contactEmail },
                ],
              },
            ],
          },
        ]
      : {};

  const round2dp = (num: number) => Math.round(num * 100) / 100;

  const clean = (obj: object | string | number) => {
    if (typeof obj !== "object") return true;
    const keys = Object.keys(obj);
    if (keys.length !== 1) return false;
    const contents = obj[keys[0]];
    if (!Array.isArray(contents)) return contents !== undefined;
    else {
      obj[keys[0]] = contents.filter((x) => clean(x));
      return obj[keys[0]].length > 0;
    }
  };

  // https://stackoverflow.com/questions/8511281/check-if-a-value-is-an-object-in-javascript
  // This next line is not a linting error.
  // eslint-disable-next-line no-unused-vars
  const check = <T>(obj: T, result: (obj: T) => object) =>
    typeof obj === "object" && !Array.isArray(obj) && obj !== null
      ? result(obj)
      : {};

  const preTaxTotal = items.reduce((p, n) => p + n.qty * n.unitPrice, 0);
  const taxAmount = round2dp(preTaxTotal * GST_RATE);
  const totalAmount = round2dp(preTaxTotal * (1 + GST_RATE));

  const xmlObject = [
    {
      "Invoice": [
        {
          "_attr": {
            "xmlns:cac":
              "urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2",
            "xmlns:cbc":
              "urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2",
            "xmlns": "urn:oasis:names:specification:ubl:schema:xsd:Invoice-2",
          },
        },
        {
          "cbc:CustomizationID":
            "urn:cen.eu:en16931:2017#conformant#urn:fdc:peppol.eu:2017:poacc:billing:international:aunz:3.0",
        },
        { "cbc:ProfileID": "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0" },
        { "cbc:ID": meta.id || 12345 },
        { "cbc:IssueDate": meta.issueDate },
        { "cbc:DueDate": meta.dueDate },
        { "cbc:InvoiceTypeCode": INVOICE_CODE },
        { "cbc:Note": meta.note },
        { "cbc:DocumentCurrencyCode": meta.currencyCode },
        { "cbc:BuyerReference": meta.reference },
        {
          "cac:InvoicePeriod": [
            { "cbc:StartDate": meta.startDate },
            { "cbc:EndDate": meta.endDate },
          ],
        },
        { "cac:AccountingSupplierParty": formatParty(supplier) },
        { "cac:AccountingCustomerParty": formatParty(customer) },
        check(meta.delivery, (x) => ({
          "cac:Delivery": [
            { "cbc:ActualDeliveryDate": x.deliveryDate },
            { "cac:DeliveryLocation": formatAddress(x.address) },
            {
              "cac:DeliveryParty": [
                { "cac:PartyName": [{ "cbc:Name": x.name }] },
              ],
            },
          ],
        })),
        {
          "cac:TaxTotal": [
            { "cbc:TaxAmount": formatCurrency(taxAmount) },
            {
              "cac:TaxSubtotal": [
                { "cbc:TaxableAmount": formatCurrency(preTaxTotal) },
                { "cbc:TaxAmount": formatCurrency(taxAmount) },
                {
                  "cac:TaxCategory": [
                    { "cbc:ID": "S" },
                    { "cbc:Percent": GST_RATE * 100 },
                    { "cac:TaxScheme": [{ "cbc:ID": "GST" }] },
                  ],
                },
              ],
            },
          ],
        },
        {
          "cac:LegalMonetaryTotal": [
            { "cbc:LineExtensionAmount": formatCurrency(preTaxTotal) },
            { "cbc:TaxExclusiveAmount": formatCurrency(preTaxTotal) },
            { "cbc:TaxInclusiveAmount": formatCurrency(totalAmount) },
            { "cbc:PayableAmount": formatCurrency(totalAmount) },
          ],
        },
        ...items.map((item, i) => ({
          "cac:InvoiceLine": [
            { "cbc:ID": i },
            {
              "cbc:InvoicedQuantity": [
                item.qty,
                { "_attr": { "unitCode": DEF_UNIT } },
              ],
            },
            {
              "cbc:LineExtensionAmount": formatCurrency(
                round2dp(item.unitPrice * item.qty)
              ),
            },
            { "cbc:AccountingCost": item.code },
            {
              "cac:InvoicePeriod": [
                { "cbc:StartDate": item.startDate },
                { "cbc:EndDate": item.endDate },
              ],
            },
            {
              "cac:Item": [
                { "cbc:Description": item.description },
                { "cbc:Name": item.name },
                {
                  "cac:BuyersItemIdentification": [
                    {
                      "cbc:ID": item.buyerId,
                    },
                  ],
                },
                {
                  "cac:SellersItemIdentification": [
                    {
                      "cbc:ID": item.sellerId,
                    },
                  ],
                },
                {
                  "cac:ClassifiedTaxCategory": [
                    { "cbc:ID": "S" },
                    { "cbc:Percent": GST_RATE * 100 },
                    { "cac:TaxScheme": [{ "cbc:ID": "GST" }] },
                  ],
                },
              ],
            },
            {
              "cac:Price": [
                {
                  "cbc:PriceAmount": formatCurrency(item.unitPrice),
                },
              ],
            },
          ],
        })),
      ],
    },
  ];

  clean(xmlObject[0]);

  return xml(xmlObject, true);
}

export function getSession(req: NextApiRequest) {
  return process.env.NODE_ENV !== "test"
    ? req.session
    : {
        user: {},
        destroy: () => Promise.resolve(),
        save: () => Promise.resolve(),
      };
}
