import { ValidationError, XMLParser, XMLValidator } from "fast-xml-parser";
import { JSONValue } from "./interfaces";
import { InvalidUBL } from "@src/error";

/**
 * Given a UBL formatted XML string, converts the tag/attribute into JSON key-value pairs.
 * @param {string} ublStr - the UBL formatted XML string to parse
 * @throws {InvalidUBL} - when XML input is invalid
 * @returns {JSONValue} - a json object representing the parsed UBL string.
 */

const textNodeName = "_text";

export function ublToJSON(ublStr: string): JSONValue {
  let errObject: ValidationError;
  if ((errObject = XMLValidator.validate(ublStr) as ValidationError)?.err) {
    throw new InvalidUBL({ message: errObject.err.msg });
  }

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
    isArray: (name, jpath) => {
      return (
        !jpathNeverArray.includes(jpath) &&
        (jpathAlwaysArray.includes(jpath) || nameAlwaysArray.includes(name))
      );
    },
    transformTagName: (tagName) => tagName.replace(/^c.c:/, ""),
    transformAttributeName: (attributeName) =>
      attributeName.replace(/^c.c:/, ""),
  };
  const parsed = new XMLParser(parseOptions).parse(ublStr).Invoice;

  return postProcessUBL(parsed, "Invoice");
}

export function formatCurrency(currencyObject: JSONValue) {
  let result = "";

  if (currencyObject["_text"] < 0) result = "-";

  // Put this in a JSON map sometime
  const currencyMap = {
    "AUD": "$",
  };

  if (Object.keys(currencyMap).includes(currencyObject["$currencyID"])) {
    result += currencyMap[currencyObject["$currencyID"]];
  }

  result += `${Math.abs(currencyObject["_text"]).toFixed(2)} ${
    currencyObject["$currencyID"]
  }`;

  return result;
}

function postProcessUBL(ublObject: JSONValue, jpath = "") {
  const alwaysTextNode: string[] = [
    "Invoice.AdditionalDocumentReference.ID",
    "Invoice.AccountingSupplierParty.Party.PartyIdentification.ID",
    "Invoice.AccountingCustomerParty.Party.PartyIdentification.ID",
    "Invoice.PayeeParty.PartyIdentification.ID",
    "Invoice.Delivery.DeliveryLocation.ID",
    "Invoice.InvoiceLine.DocumentReference.ID",
    "Invoice.AccountingSupplierParty.Party.PartyLegalEntity.CompanyID",
    "Invoice.AccountingCustomerParty.Party.PartyLegalEntity.CompanyID",
    "Invoice.PayeeParty.PartyLegalEntity.CompanyID",
    "Invoice.PaymentMeans.PaymentMeansCode",
    "Invoice.InvoiceLine.Price.BaseQuantity",
  ];

  if (["string", "number", "boolean"].includes(typeof ublObject)) {
    if (alwaysTextNode.includes(jpath)) return { [textNodeName]: ublObject };
    return ublObject;
  }

  const result: JSONValue = Array.isArray(ublObject) ? [] : {};
  for (const element in ublObject as Object) {
    result[element] = postProcessUBL(
      ublObject[element],
      Array.isArray(ublObject) ? jpath : `${jpath}.${element}`
    );
  }

  return result;
}
