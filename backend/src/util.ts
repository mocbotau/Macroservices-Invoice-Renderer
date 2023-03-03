import { ValidationError, XMLParser, XMLValidator } from "fast-xml-parser";


/**
 * Given a UBL formatted XML string, converts the tag/attribute into JSON key-value pairs.
 * @param {string} ublStr - the UBL formatted XML string to parse
 * @throws {Error} - when XML input is invalid
 * @returns {Record<string, string | number | object>} - a json object representing the parsed UBL string.
 */
export function ublToJSON(ublStr: string): Record<string, string | number | object> {
  let errObject: ValidationError;
  if ((errObject = (XMLValidator.validate(ublStr) as ValidationError))?.err) {
    throw Error(errObject.err.msg);
  }
  return new XMLParser().parse(ublStr).Invoice;
}