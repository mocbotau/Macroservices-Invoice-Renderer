import { AppErrorArgs } from "@src/interfaces";

// Custom error class for known error cases
export class AppError extends Error {
  public readonly statusCode: number;

  constructor(args?: AppErrorArgs) {
    super();
    this.name = this.constructor.name;

    Object.setPrototypeOf(this, new.target.prototype);

    if (this instanceof UnauthorisedError) {
      this.message = "The provided API key is invalid.";
      this.statusCode = 401;
    } else if (this instanceof InvalidUBL) {
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

export class InvalidUBL extends AppError {}
export class InvalidStyle extends AppError {}
export class InvalidLanguage extends AppError {}
export class UnauthorisedError extends AppError {}
