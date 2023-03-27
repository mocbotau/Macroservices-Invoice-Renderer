import { InvoiceItem, JSONValue, InvoiceMetadata } from "./interfaces";
import { json2xml } from "xml-js";

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

export function generateXML(items: InvoiceItem[], meta: InvoiceMetadata) {
  const xmlObject: JSONValue = {};

  meta.currencyCode = meta.currencyCode || "AUD";

  const applyMap = (
    item: JSONValue,
    map: Map<string, Array<string>>,
    init: JSONValue
  ) => {
    Object.keys(item)
      .filter((prop) => item[prop] !== undefined)
      .filter((prop) => invoiceItemMap.get(prop) !== undefined)
      .forEach((prop) => {
        map.get(prop)?.reduce((prev, next, i, arr) => {
          if (typeof prev === "object") {
            if (i === arr.length - 1)
              return (prev[next] = { "_text": item[prop] });
            if (prev[next] === undefined) prev[next] = {};
            return prev[next];
          }
        }, init);
      });
  };

  const invoiceItemMap = new Map<string, Array<string>>([
    ["qty", ["cbc:InvoicedQuantity"]],
    ["code", ["cbc:AccountCost"]],
    ["startDate", ["cac:InvoicePeriod", "cbc:StartDate"]],
    ["endDate", ["cac:InvoicePeriod", "cbc:EndDate"]],
    ["name", ["cac:Item", "cbc:Name"]],
    ["buyerId", ["cac:Item", "cac:BuyersItemIdentification"]],
    ["sellerId", ["cac:Item", "cac:SellersItemIdentification"]],
    ["unitPrice", ["cac:Price", "cbc:PriceAmount"]],
  ]);

  const invoiceMetaMap = new Map<string, Array<string>>([
    ["id", ["cbc:ID"]],
    ["note", ["cbc:Note"]],
    ["issueDate", ["cbc:IssueDate"]],
    ["dueDate", ["cbc:DueDate"]],
    ["currencyCode", ["cbc:DocumentCurrencyCode"]],
    ["startDate", ["cac:InvoicePeriod", "cbc:StartDate"]],
    ["endDate", ["cac:InvoicePeriod", "cbc:EndDate"]],
    ["buyerId", ["cac:Item", "cac:BuyersItemIdentification"]],
    ["sellerId", ["cac:Item", "cac:SellersItemIdentification"]],
    ["unitPrice", ["cac:Price", "cbc:PriceAmount"]],
  ]);

  xmlObject["cbc:CustomizationID"] =
    "urn:cen.eu:en16931:2017#compliant#urn:fdc:peppol.eu:2017:poacc:billing:3.0";
  xmlObject["cbc:ProfileID"] = "urn:fdc:peppol.eu:2017:poacc:billing:01:1.0";
  xmlObject["cbc:InvoiceTypeCode"] = "380";

  xmlObject["ubl:InvoiceLine"] = items.map((item, i) => {
    const line: JSONValue = {};
    line["cbc:ID"] = { "_text": i };

    line["cbc:LineExtensionAmount"] = {
      "_text":
        line["cbc:InvoicedQuantity"]["_text"] *
        line["cac:Price"]["cbc:PriceAmount"]["_text"],
      "_attributes": { currencyID: meta.currencyCode as string },
    };
    line["cac:Price"]["cbc:PriceAmount"]["_attributes"] = {
      currencyID: meta.currencyCode as string,
    };
    line["cbc:InvoicedQuantity"]["_attributes"] = { unitCode: "C62" };
    return line;
  });

  return json2xml(JSON.stringify(xmlObject), { compact: true, spaces: 2 });
}
