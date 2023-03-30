export interface InvoiceOptionType {
  name: string;
  id: string;
  toggleable?: boolean;
  description?: string;
  items: InvoiceOptionItems[];
}

export interface InvoiceOptionItems {
  name: string;
  description: string;
  required: boolean;
  colour: string;
  id: string;
  dependent?: string;
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
        required: false,
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
        colour: "#ffadad",
        id: "party_abn",
      },
      {
        name: "Name",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffd6a5",
        id: "party_name",
      },
      {
        name: "Address",
        description: "Lorem ipsum",
        required: false,
        colour: "#fdffb6",
        id: "party_address",
      },
      {
        name: "Address 2",
        description: "Lorem ipsum",
        required: false,
        colour: "#caffbf",
        id: "party_address_2",
      },
      {
        name: "Suburb",
        description: "Lorem ipsum",
        required: false,
        colour: "#9bf6ff",
        id: "party_suburb",
      },
      {
        name: "Postcode",
        description: "Lorem ipsum",
        required: false,
        colour: "#a0c4ff",
        id: "party_postcode",
      },
      {
        name: "State",
        description: "Lorem ipsum",
        required: false,
        colour: "#bdb2ff",
        id: "party_state",
      },
      {
        name: "Country",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffc6ff",
        id: "party_country",
      },
      {
        name: "Contact Name",
        description: "Lorem ipsum",
        required: false,
        colour: "#eeeeee",
        id: "party_contact_name",
      },
      {
        name: "Contact Phone",
        description: "Lorem ipsum",
        required: false,
        colour: "#444444",
        id: "party_contact_phone",
      },
      {
        name: "Contact Email",
        description: "Lorem ipsum",
        required: false,
        colour: "#d5bdaf",
        id: "party_contact_email",
      },
    ],
  },
  {
    name: "Invoice Delivery",
    id: "invoice_delivery",
    toggleable: true,
    items: [
      {
        name: "Name",
        description: "Lorem ipsum",
        required: true,
        colour: "#ffadad",
        id: "delivery_name",
      },
      {
        name: "Delivery Date",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffd6a5",
        id: "delivery_date",
      },
      {
        name: "Address",
        description: "Lorem ipsum",
        required: false,
        colour: "#fdffb6",
        id: "delivery_address",
        dependent: "delivery_name",
      },
      {
        name: "Address 2",
        description: "Lorem ipsum",
        required: false,
        colour: "#caffbf",
        id: "delivery_address_2",
        dependent: "delivery_name",
      },
      {
        name: "Suburb",
        description: "Lorem ipsum",
        required: false,
        colour: "#9bf6ff",
        id: "delivery_suburb",
        dependent: "delivery_name",
      },
      {
        name: "Postcode",
        description: "Lorem ipsum",
        required: false,
        colour: "#a0c4ff",
        id: "delivery_postcode",
        dependent: "delivery_name",
      },
      {
        name: "State",
        description: "Lorem ipsum",
        required: false,
        colour: "#bdb2ff",
        id: "delivery_state",
        dependent: "delivery_name",
      },
      {
        name: "Country",
        description: "Lorem ipsum",
        required: false,
        colour: "#ffc6ff",
        id: "delivery_country",
        dependent: "delivery_name",
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
