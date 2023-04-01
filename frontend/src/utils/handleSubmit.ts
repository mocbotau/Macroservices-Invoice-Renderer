import { invoiceOptions } from "@src/components/csvConfiguration/csvConfigurationFields";
import { INVOICE_DELIVERY } from "@src/constants";
import {
  AllInvoiceObjectTypes,
  InvoiceAddress,
  InvoiceDelivery,
  InvoiceItem,
  InvoiceMetadata,
  InvoiceParty,
  SelectedData,
  SetStateType,
} from "@src/interfaces";
import {
  extractNumber,
  generateXML,
  getDependentRequiredFields,
  getInvoiceItemIDs,
  lettersToNumber,
} from "../utils";

const requiredFields: string[] = [];

invoiceOptions.forEach((category) => {
  category.items.forEach((item) => {
    if (item.required) {
      if (category.id === "invoice_parties") {
        requiredFields.push(`from_${item.id}`, `to_${item.id}`);
      } else {
        requiredFields.push(item.id);
      }
    }
  });
});

const invoiceItemIDs = getInvoiceItemIDs();
const deliveryDependentFields = getDependentRequiredFields(
  "delivery_name",
  INVOICE_DELIVERY
);

/**
 * Sets the required fields state to true if there are some required fields that are empty, proceeds to
 * process the data if otherwise all filled.
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @param {Function} setShowRequired - set the state for required fields
 * @param {Function} setDeliveryRequired - set the state for delivery field being required
 * @param {Function} setShowSnackbar - set the state for the snackbar
 * @param {Function} setShowLoading - set the state for the loading status on the next button
 * @param {SelectedData} selection - the data of the selected rows for invoice item
 * @param {boolean} hasHeaders - a boolean to indicate whether the values in the first row selected are headers
 */
export function handleSubmit(
  textFieldsState: Record<string, string>,
  setShowRequired: SetStateType<boolean>,
  setDeliveryRequired: SetStateType<boolean>,
  setShowSnackbar: SetStateType<boolean>,
  setShowLoading: SetStateType<boolean>,
  setLoadedXML: (string) => void,
  selection: SelectedData,
  hasHeaders: boolean
): void {
  const emptyFields = requiredFields.some((field) => {
    return textFieldsState[field].length === 0;
  });

  const deliveryNameEmpty =
    deliveryDependentFields.some((field) => {
      return textFieldsState[field].length !== 0;
    }) && textFieldsState["delivery_name"].length === 0;

  if (emptyFields || deliveryNameEmpty) {
    setShowRequired(emptyFields);
    setDeliveryRequired(deliveryNameEmpty);
    return setShowSnackbar(true);
  } else {
    setShowLoading(true);

    const items = convertItems(textFieldsState, hasHeaders, selection);
    const supplier = convertParty(textFieldsState, "from_party_");
    const customer = convertParty(textFieldsState, "to_party_");
    const meta = convertMetadata(textFieldsState);
    setLoadedXML(generateXML(items, meta, supplier, customer));
    setShowLoading(false);
  }
}

/**
 * Given the text field state object, extract the relevant information to fill the InvoiceMetadata object
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @returns {InvoiceMetadata} - the completed metadata object
 */
function convertMetadata(
  textFieldsState: Record<string, string>
): InvoiceMetadata {
  const delivery = convertDelivery(textFieldsState);

  return removeEmptyValues({
    name: textFieldsState["invoice_name"],
    id: textFieldsState["invoice_id"],
    issueDate: textFieldsState["invoice_issue_date"],
    dueDate: textFieldsState["invoice_due_date"],
    startDate: textFieldsState["invoice_start_date"],
    endDate: textFieldsState["invoice_end_date"],
    currencyCode: textFieldsState["invoice_currency_code"],
    note: textFieldsState["invoice_notes"],
    delivery: !("name" in delivery) ? undefined : delivery,
    reference: textFieldsState["invoice_reference"],
  }) as InvoiceMetadata;
}

/**
 * Given the text field state object, extract the relevant information to fill the InvoiceDelivery object
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @returns {InvoiceDelivery} - the completed delivery object
 */
function convertDelivery(
  textFieldsState: Record<string, string>
): InvoiceDelivery {
  const address = convertAddress(textFieldsState, "delivery_");

  return removeEmptyValues({
    name: textFieldsState["delivery_name"],
    deliveryDate: textFieldsState["delivery_date"],
    address: Object.keys(address).length === 0 ? undefined : address,
  }) as InvoiceDelivery;
}

/**
 * Given the text field state object, extract the relevant information to fill the InvoiceAddress object
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @param {string} prefix - represents the section of which the address is coming from
 * @returns {InvoiceAddress} - the completed address object
 */
function convertAddress(
  textFieldsState: Record<string, string>,
  prefix: string
): InvoiceAddress {
  return removeEmptyValues({
    streetAddress: textFieldsState[prefix + "address"],
    extraLine: textFieldsState[prefix + "address_2"],
    suburb: textFieldsState[prefix + "suburb"],
    postcode: textFieldsState[prefix + "postcode"],
    state: textFieldsState[prefix + "state"],
    country: textFieldsState[prefix + "country"],
  }) as InvoiceAddress;
}

/**
 * Given the text field state object, extract the relevant information to fill the InvoiceParty object
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @param {string} prefix - represents the section of which the party is coming from
 * @returns {InvoiceParty} - the completed party object
 */
function convertParty(
  textFieldsState: Record<string, string>,
  prefix: string
): InvoiceParty {
  const address = convertAddress(textFieldsState, prefix);

  return removeEmptyValues({
    abn: textFieldsState[prefix + "abn"],
    name: textFieldsState[prefix + "name"],
    address: Object.keys(address).length === 0 ? undefined : address,
    contactName: textFieldsState[prefix + "contact_name"],
    contactPhone: textFieldsState[prefix + "contact_phone"],
    contactEmail: textFieldsState[prefix + "contact_email"],
  }) as InvoiceParty;
}

/**
 * Given the input data, extract the relevant information to fill an array of InvoiceItem objects
 *
 * @param {Record<string, string>} textFieldsState - the object holding the values of all text field components
 * @param {string[][]} selection - the data of the selected rows for invoice item
 * @param {boolean} hasHeaders - a boolean to indicate whether the values in the first row selected are headers
 * @returns {InvoiceItem[]} - the completed item objects
 */
function convertItems(
  textFieldsState: Record<string, string>,
  hasHeaders: boolean,
  selection: SelectedData
): InvoiceItem[] {
  const selectedColumnNames = invoiceItemIDs.map((id) => {
    return textFieldsState[id[0]];
  });
  let selectedColumnIndexes: number[];

  const dataClone = [...selection.data];

  if (hasHeaders) {
    const headerRow = dataClone.shift();
    selectedColumnIndexes = selectedColumnNames.map((name) => {
      return (headerRow as string[]).indexOf(name);
    });
  } else {
    selectedColumnIndexes = selectedColumnNames.map((name) => {
      return lettersToNumber(name.replace("Column ", "")) - 1;
    });
  }

  return dataClone.map((row) => {
    return removeEmptyValues({
      name: row[selectedColumnIndexes[0]],
      qty: extractNumber(row[selectedColumnIndexes[1]]),
      unitPrice: extractNumber(row[selectedColumnIndexes[2]]),
      code: checkIfNotSelected(row, selectedColumnIndexes, 3),
      buyerId: checkIfNotSelected(row, selectedColumnIndexes, 4),
      sellerId: checkIfNotSelected(row, selectedColumnIndexes, 5),
      description: checkIfNotSelected(row, selectedColumnIndexes, 6),
      startDate: checkIfNotSelected(row, selectedColumnIndexes, 7),
      endDate: checkIfNotSelected(row, selectedColumnIndexes, 8),
      unit: checkIfNotSelected(row, selectedColumnIndexes, 9),
    }) as InvoiceItem;
  });
}

/**
 * Returns an empty string if the index in indexes is -1
 * @param {string[]} row - the data in the row
 * @param {number[]} indexes - the list of column indexes
 * @param {number} i - the index to check for
 * @returns {string} - the returned string
 */
function checkIfNotSelected(
  row: string[],
  indexes: number[],
  i: number
): string {
  return indexes[i] === -1 ? "" : row[indexes[i]];
}

/**
 * Takes in any object and removes all the fields with blank values
 *
 * @param {AllInvoiceObjectTypes} obj - the object to remove empty fields
 * @returns {AllInvoiceObjectTypes} - the returned object
 */
function removeEmptyValues(obj: AllInvoiceObjectTypes): AllInvoiceObjectTypes {
  return Object.fromEntries(
    // eslint-disable-next-line
    Object.entries(obj).filter(([_, v]) => v !== "" && v !== undefined)
  );
}
