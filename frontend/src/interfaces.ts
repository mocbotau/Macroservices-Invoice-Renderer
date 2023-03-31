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
  address: InvoiceAddress;
}

export interface InvoiceMetadata {
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
  address: InvoiceAddress;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}

export type APIResponse = {
  status: number;
  json?: { error?: string };
};

export type ConstantMap = [
  Array<string>,
  ((x: JSONValue) => JSONValue) | JSONValue
][];

export type XMLStructure = [string, XMLStructure[] | string | undefined];
