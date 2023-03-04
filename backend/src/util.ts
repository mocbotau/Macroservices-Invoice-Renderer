import { ValidationError, XMLParser, XMLValidator } from "fast-xml-parser";
import { JSONValue } from "./interfaces";

/**
 * Given a UBL formatted XML string, converts the tag/attribute into JSON key-value pairs.
 * @param {string} ublStr - the UBL formatted XML string to parse
 * @throws {Error} - when XML input is invalid
 * @returns {JSONValue} - a json object representing the parsed UBL string.
 */
export function ublToJSON(ublStr: string): JSONValue {
  let errObject: ValidationError;
  if ((errObject = XMLValidator.validate(ublStr) as ValidationError)?.err) {
    throw Error(errObject.err.msg);
  }
  
  const parseOptions = {
    ignoreAttributes: false,
    textNodeName: "#text"
  };
  const parsed = new XMLParser(parseOptions).parse(ublStr).Invoice;

  return removeUBLPrefix(parsed);
}

function removeUBLPrefix(ublObject: JSONValue){
  if (["string", "number", "boolean"].includes(typeof ublObject)) {
    return ublObject;
  }

  const result: JSONValue = {};
  for (const element of Object.keys(ublObject)) {
    result[element.replace(/^c.c:/, "")] = removeUBLPrefix(ublObject[element]);
  }

  return result;
}
