import { ValidationError, XMLParser, XMLValidator } from "fast-xml-parser";
import { JSONValue } from "./interfaces";
import { InvalidUBL } from "@src/error";

/**
 * Given a UBL formatted XML string, converts the tag/attribute into JSON key-value pairs.
 * @param {string} ublStr - the UBL formatted XML string to parse
 * @throws {InvalidUBL} - when XML input is invalid
 * @returns {JSONValue} - a json object representing the parsed UBL string.
 */
export function ublToJSON(ublStr: string): JSONValue {
  let errObject: ValidationError;
  if ((errObject = XMLValidator.validate(ublStr) as ValidationError)?.err) {
    throw new InvalidUBL({ message: errObject.err.msg });
  }
  return new XMLParser().parse(ublStr).Invoice;
}
