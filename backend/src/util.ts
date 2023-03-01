import { ValidationError, XMLParser, XMLValidator } from "fast-xml-parser";

export function ublToJSON(ublStr: string) {
  let errObject: ValidationError;
  if ((errObject = (XMLValidator.validate(ublStr) as ValidationError))?.err) {
    throw Error(errObject.err.msg);
  }
  return new XMLParser().parse(ublStr).Invoice;
}