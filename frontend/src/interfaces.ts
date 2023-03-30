export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export type APIResponse = {
  status: number;
  json?: { error?: string };
};

export type InvoiceSendOptions = "email" | "sms";
export type InvoiceSendExtOptions = "json" | "pdf" | "html" | "xml";
