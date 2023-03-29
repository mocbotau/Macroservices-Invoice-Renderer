export interface InvoiceOptionType {
  name: string;
  id: string;
  description?: string;
  items: InvoiceOptionItems[];
}

export interface InvoiceOptionItems {
  name: string;
  description: string;
  required: boolean;
  colour: string;
  id: string;
}

export const invoiceOptions: InvoiceOptionType[] = [
  {
    name: "Invoice Metadata",
    id: "invoice_metadata",
    items: [
      {
        name: "Invoice Name",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffb3ba",
        id: "invoice_name",
      },
      {
        name: "ID",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffdfba",
        id: "invoice_id",
      },
      {
        name: "Issue Date",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffffba",
        id: "invoice_issue_date",
      },
      {
        name: "Due Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#baffc9",
        id: "invoice_due_date",
      },
      {
        name: "Start Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#9bf6ff",
        id: "invoice_start_date",
      },
      {
        name: "End Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#a0c4ff",
        id: "invoice_end_date",
      },
      {
        name: "Currency Code",
        description: "Lorem ipsum",
        required: false,
        colour: "#C3B1E1",
        id: "invoice_currency_code",
      },
      {
        name: "Note",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffc6ff",
        id: "invoice_notes",
      },
    ],
  },
  {
    name: "Invoice Parties",
    id: "invoice_parties",
    items: [
      {
        name: "ABN",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffb3ba",
        id: "party_abn",
      },
      {
        name: "Name",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffdfba",
        id: "party_name",
      },
      {
        name: "Address",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffffba",
        id: "party_address",
      },
      {
        name: "Contact Name",
        description: "Lorem ipsum",
        required: false,
        colour: "#baffc9",
        id: "party_contact_name",
      },
      {
        name: "Contact Phone",
        description: "Lorem ipsum",
        required: false,
        colour: "#bae1ff",
        id: "party_contact_phone",
      },
      {
        name: "Contact Email",
        description: "Lorem ipsum",
        required: false,
        colour: "#C3B1E1",
        id: "party_contact_email",
      },
    ],
  },
  {
    name: "Invoice Delivery",
    id: "invoice_delivery",
    items: [
      {
        name: "Name",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffb3ba",
        id: "delivery_name",
      },
      {
        name: "Delivery Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffdfba",
        id: "delivery_date",
      },
    ],
  },
  {
    name: "Invoice Address",
    id: "invoice_address",
    items: [
      {
        name: "Address",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffb3ba",
        id: "street_address",
      },
      {
        name: "Address 2",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffdfba",
        id: "address_extra_line",
      },
      {
        name: "Suburb",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffffba",
        id: "address_suburb",
      },
      {
        name: "Postcode",
        description: "Lorem ipsum",
        required: false,
        colour: "#baffc9",
        id: "address_postcode",
      },
      {
        name: "State",
        description: "Lorem ipsum",
        required: false,
        colour: "#bae1ff",
        id: "address_state",
      },
      {
        name: "Country",
        description: "Lorem ipsum",
        required: false,
        colour: "#C3B1E1",
        id: "address_contact_email",
      },
    ],
  },
  {
    name: "Invoice Item",
    id: "invoice_item",
    description:
      "Please select a range in the sheet first. Then, correlate the information below to the column within that selected range.",
    items: [
      {
        name: "Name",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffb3ba",
        id: "item_name",
      },
      {
        name: "Quantity",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffdfba",
        id: "item_quantity",
      },
      {
        name: "Unit Price",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffffba",
        id: "item_unit_price",
      },
      {
        name: "Code",
        description: "Lorem ipsum",
        required: false,
        colour: "#baffc9",
        id: "item_code",
      },
      {
        name: "Buyer ID",
        description: "Lorem ipsum",
        required: false,
        colour: "#9bf6ff",
        id: "item_buyerID",
      },
      {
        name: "Seller ID",
        description: "Lorem ipsum",
        required: false,
        colour: "#a0c4ff",
        id: "item_sellerID",
      },
      {
        name: "Description",
        description: "Lorem ipsum",
        required: false,
        colour: "#bdb2ff",
        id: "item_description",
      },
      {
        name: "Start Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffc6ff",
        id: "item_start_date",
      },
      {
        name: "End Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#dddddd",
        id: "item_end_date",
      },
      {
        name: "Unit",
        description: "Lorem ipsum",
        required: false,
        colour: "#a0a0a0",
        id: "item_unit",
      },
    ],
  },
];
