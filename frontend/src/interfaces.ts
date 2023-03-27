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
  startDate?: Date;
  endDate?: Date;
  unit?: string;
}

export interface InvoiceAddress {
  streetAddress?: string;
  suburb?: string;
  postcode?: string;
  state?: string;
  country: string;
}

export interface InvoiceDelivery {
  name: string;
  deliveryDate?: Date;
  address: InvoiceAddress;
}

export interface InvoiceMetadata {
  id?: string;
  issueDate?: Date;
  dueDate?: Date;
  startDate?: Date;
  endDate?: Date;
  currencyCode?: string;
  note?: string;
  delivery?: InvoiceDelivery;
}

export interface InvoiceParty {
  abn: string;
  name?: string;
  address: InvoiceAddress;
  contactName?: string;
  contactPhone?: string;
  contactEmail?: string;
}
