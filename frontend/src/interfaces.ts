import { ISODateString } from "next-auth";

export type JSONValue =
  | string
  | number
  | boolean
  | { [x: string]: JSONValue }
  | Array<JSONValue>;

export interface InvoiceItem {
  name: string;
  qty: number;
  unitPrice: number;
  code?: string;
  buyerId?: string;
  sellerId?: string;
  description?: string;
  startDate?: string;
  endDate?: string;
  unit?: string;
}

export interface InvoiceAddress {
  extraLine?: string;
  streetAddress?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country?: string;
}

export interface InvoiceDelivery {
  name: string;
  deliveryDate?: string;
  address?: InvoiceAddress;
}

export interface InvoiceMetadata {
  name: string;
  id?: string;
  issueDate?: string;
  dueDate?: string;
  startDate?: string;
  endDate?: string;
  currencyCode?: string;
  note?: string;
  delivery?: InvoiceDelivery;
  reference?: string;
}

export interface InvoiceParty {
  abn: string;
  name: string;
  address?: InvoiceAddress;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export type APIResponse = {
  status: number;
  json?: { error?: string };
};

export type Row = string[];

export interface SelectedData {
  data: string[][];
  startRow: number;
  startCol: number;
  endRow: number;
  endCol: number;
}

export interface MultiSelectRange {
  rangeString: string;
  data: string[][];
}

export type SetStateType<T> = React.Dispatch<React.SetStateAction<T>>;

export type AllInvoiceObjectTypes =
  | InvoiceMetadata
  | InvoiceParty
  | InvoiceDelivery
  | InvoiceAddress
  | InvoiceItem;

export const emptySelection = {
  data: [],
  startRow: -1,
  startCol: -1,
  endRow: -1,
  endCol: -1,
};
export type InvoiceSendOptions = "email" | "sms";
export type InvoiceSendExtOptions = "json" | "pdf" | "html" | "xml";

export interface Session {
  email?: string;
  name?: string;
  sub?: string;
}

export interface Emails {
  id: string;
  name: string;
  email: string;
}
export interface PhoneNumbers {
  id: string;
  name: string;
  phone: string;
}
export interface SessionWithSub {
  user?: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
    sub?: string | null;
  };
  expires: ISODateString;
}
