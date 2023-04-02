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
  important?: boolean;
  required: boolean;
  colour: string;
  id: string;
  dependent?: string;
}

export const instructionsForUse =
  "Fill in all fields relevant to your CSV. You may either manually enter in data, or select the text field, followed by a cell in the table that contains the data. Please note that the table is editable, allowing you to add additional data.";

export const invoiceOptions: InvoiceOptionType[] = [
  {
    name: "Invoice Metadata",
    id: "invoice_metadata",
    items: [
      {
        name: "Invoice Name",
        description: "The name of the invoice.",
        required: true,
        colour: "#ffb3ba",
        id: "invoice_name",
      },
      {
        name: "ID",
        description:
          "The ID of the invoice. If this is not provided, a random ID will be generated",
        important: true,
        required: false,
        colour: "#ffdfba",
        id: "invoice_id",
      },
      {
        name: "Issue Date",
        description:
          "The date that this invoice was issued. If not entered, this will default to today.",
        important: true,
        required: false,
        colour: "#ffffba",
        id: "invoice_issue_date",
      },
      {
        name: "Due Date",
        description:
          "The date that this invoice is due. If not entered, this will default to two weeks from today.",
        important: true,
        required: false,
        colour: "#baffc9",
        id: "invoice_due_date",
      },
      {
        name: "Start Date",
        description: "The start date of the invoicing period, if applicable.",
        required: false,
        colour: "#9bf6ff",
        id: "invoice_start_date",
      },
      {
        name: "End Date",
        description: "The end date of the invoicing period, if applicable.",
        required: false,
        colour: "#a0c4ff",
        id: "invoice_end_date",
      },
      {
        name: "Currency Code",
        description: "The ISO currency to use for the period. Default is AUD.",
        required: false,
        colour: "#C3B1E1",
        id: "invoice_currency_code",
      },
      {
        name: "Notes",
        description: "Any additional notes for the invoice.",
        required: false,
        colour: "#ffc6ff",
        id: "invoice_notes",
      },
      {
        name: "Reference",
        description:
          "The invoice's customer reference. If not entered, this will default to 'Generic'.",
        important: true,
        required: false,
        colour: "#eeeeee",
        id: "invoice_reference",
      },
    ],
  },
  {
    name: "Invoice Parties",
    id: "invoice_parties",
    items: [
      {
        name: "ABN",
        description: "The Australian Business Number of the business.",
        required: true,
        colour: "#ffadad",
        id: "party_abn",
      },
      {
        name: "Name",
        description: "The name of the business.",
        required: true,
        colour: "#ffd6a5",
        id: "party_name",
      },
      {
        name: "Street Address",
        description:
          "The street address of the business. Please note that if no address details are provided, the default address will default to the country of Australia.",
        important: true,
        required: false,
        colour: "#fdffb6",
        id: "party_address",
      },
      {
        name: "Street Address 2",
        description: "The second address line of the business, if applicable.",
        required: false,
        colour: "#caffbf",
        id: "party_address_2",
      },
      {
        name: "Suburb",
        description: "The suburb of the address.",
        required: false,
        colour: "#9bf6ff",
        id: "party_suburb",
      },
      {
        name: "Postcode",
        description: "The postcode of the address.",
        required: false,
        colour: "#a0c4ff",
        id: "party_postcode",
      },
      {
        name: "State",
        description: "The state of the address.",
        required: false,
        colour: "#bdb2ff",
        id: "party_state",
      },
      {
        name: "Country",
        description: "The ISO country code of the address.",
        required: false,
        colour: "#ffc6ff",
        id: "party_country",
      },
      {
        name: "Contact Name",
        description: "The contact name of the representative of the business.",
        required: false,
        colour: "#eeeeee",
        id: "party_contact_name",
      },
      {
        name: "Contact Phone",
        description: "The contact phone of the representative of the business.",
        required: false,
        colour: "#444444",
        id: "party_contact_phone",
      },
      {
        name: "Contact Email",
        description: "The contact email of the representative of the business.",
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
        description:
          "The name of whom this invoice should be delivered to. Please note, that this field is required if any other fields below are provided.",
        important: true,
        required: false,
        colour: "#ffadad",
        id: "delivery_name",
      },
      {
        name: "Delivery Date",
        description: "The date of which this invoice should be delivered.",
        required: false,
        colour: "#ffd6a5",
        id: "delivery_date",
        dependent: "delivery_name",
      },
      {
        name: "Street Address",
        description:
          "The main address line of the address to deliver to. Please note that if no address is provided and a name is provided, the default address will be the country of Australia.",
        important: true,
        required: false,
        colour: "#fdffb6",
        id: "delivery_address",
        dependent: "delivery_name",
      },
      {
        name: "Street Address 2",
        description: "The second address line of the address to deliver to.",
        required: false,
        colour: "#caffbf",
        id: "delivery_address_2",
        dependent: "delivery_name",
      },
      {
        name: "Suburb",
        description: "The suburb of the address to deliver to.",
        required: false,
        colour: "#9bf6ff",
        id: "delivery_suburb",
        dependent: "delivery_name",
      },
      {
        name: "Postcode",
        description: "The postcode of the address to deliver to.",
        required: false,
        colour: "#a0c4ff",
        id: "delivery_postcode",
        dependent: "delivery_name",
      },
      {
        name: "State",
        description: "The state of the address to deliver to.",
        required: false,
        colour: "#bdb2ff",
        id: "delivery_state",
        dependent: "delivery_name",
      },
      {
        name: "Country",
        description: "The country of the address to deliver to.",
        required: false,
        colour: "#ffc6ff",
        id: "delivery_country",
        dependent: "delivery_name",
      },
    ],
  },
  {
    name: "Invoice Items",
    id: "invoice_items",
    description:
      "Please select a range in the sheet first. Then, correlate the information below to the column within that selected range.",
    items: [
      {
        name: "Name",
        description: "The name of the item.",
        required: true,
        colour: "#ffb3ba",
        id: "item_name",
      },
      {
        name: "Quantity",
        description: "The number of a specific item.",
        required: true,
        colour: "#ffdfba",
        id: "item_quantity",
      },
      {
        name: "Unit Price",
        description: "The unit price of the item.",
        required: true,
        colour: "#ffffba",
        id: "item_unit_price",
      },
      {
        name: "Code",
        description: "Any associated item code of the item.",
        required: false,
        colour: "#baffc9",
        id: "item_code",
      },
      {
        name: "Buyer ID",
        description: "The ID of the buyer of the item.",
        required: false,
        colour: "#9bf6ff",
        id: "item_buyerID",
      },
      {
        name: "Seller ID",
        description: "The ID of the seller of the item.",
        required: false,
        colour: "#a0c4ff",
        id: "item_sellerID",
      },
      {
        name: "Description",
        description: "The description of the item.",
        required: false,
        colour: "#bdb2ff",
        id: "item_description",
      },
      {
        name: "Start Date",
        description: "The start date of a service/item.",
        required: false,
        colour: "#ffc6ff",
        id: "item_start_date",
      },
      {
        name: "End Date",
        description: "The end date of a service/item.",
        required: false,
        colour: "#dddddd",
        id: "item_end_date",
      },
      {
        name: "Unit",
        description: "The unit of the item.",
        required: false,
        colour: "#a0a0a0",
        id: "item_unit",
      },
    ],
  },
];
