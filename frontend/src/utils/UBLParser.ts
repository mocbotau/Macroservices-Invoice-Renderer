import { XMLParser } from "fast-xml-parser";

const textNodeName = "_text";

/**
 * Given a UBL formatted XML string, converts the tag/attribute into JSON key-value pairs.
 * @param {string} ublStr - the UBL formatted XML string to parse
 * @throws {InvalidUBL} - when XML input is invalid
 * @returns {object} - a json object representing the parsed UBL string.
 */
export function ublToJSON(ublStr: string) {
  const nameAlwaysArray: string[] = [
    "BillingReference",
    "AdditionalDocumentReference",
    "PaymentMeans",
    "AllowanceCharge",
    "TaxSubtotal",
    "InvoiceLine",
    "CommodityClassification",
    "AdditionalItemProperty",
    "PartyIdentification", // This actually does not match the UBL spec, but makes things more convenient.
  ];

  const jpathAlwaysArray: string[] = [
    // "Invoice.AccountingSupplierParty.Party.PartyIdentification",
  ];

  const jpathNeverArray: string[] = [
    "Invoice.InvoiceLine.Price.AllowanceCharge",
  ];

  const parseOptions = {
    ignoreAttributes: false,
    textNodeName: textNodeName,
    attributeNamePrefix: "$",
    numberParseOptions: {
      leadingZeros: true,
      hex: true,
      skipLike: /^[+]?[(]?[0-9]{3}[)]?[-\s.]?[0-9]{3}[-\s.]?[0-9]{4,6}$/,
    },
    isArray: (name: string, jpath: string) => {
      return (
        !jpathNeverArray.includes(jpath) &&
        (jpathAlwaysArray.includes(jpath) || nameAlwaysArray.includes(name))
      );
    },
    transformTagName: (tagName: string) => tagName.replace(/^c.c:/, ""),
    transformAttributeName: (attributeName: string) =>
      attributeName.replace(/^c.c:/, ""),
  };
  return new XMLParser(parseOptions).parse(ublStr).Invoice;
}
