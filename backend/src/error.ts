import { InputErrorArgs } from "@src/interfaces";

// Custom error class for known error cases
export class InputError extends Error {
  public readonly statusCode: number;

  constructor(args?: InputErrorArgs) {
    super();
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);

    if (this instanceof InvalidUBL) {
      this.message = args.message || "The provided UBL is invalid.";
      this.statusCode = 422;
    } else if (this instanceof InvalidStyle) {
      this.message = "The provided style number is invalid.";
      this.statusCode = 400;
    } else if (this instanceof InvalidLanguage) {
      this.message = "The provided language is invalid.";
      this.statusCode = 400;
    }
  }
}

export class InvalidUBL extends InputError {}
export class InvalidStyle extends InputError {}
export class InvalidLanguage extends InputError {}
