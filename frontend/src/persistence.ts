import { GST_RATE, SAVE_FILE_KEY } from "./constants";
import { MultiSelectRange, SelectedData } from "./interfaces";
import { extractNumber, formatCurrency } from "./utils";
import { ublToJSON } from "./utils/UBLParser";

/**
 * Saves an invoice locally
 *
 * @param {File} f
 * @param {string} ubl
 * @param {AllFields} states
 * @param {SelectedDate} selected
 */
export async function newInvoice(
  f: File,
  states: AllFields,
  selected: SelectedData
): Promise<number> {
  const fText = f ? await f.text() : null;
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");
  const newId = (files.length === 0 ? 0 : files.slice(-1)[0].id) + 1;
  localStorage.setItem(
    SAVE_FILE_KEY,
    JSON.stringify([
      ...files,
      { id: newId, file: fText, ubl: null, states: states, selected: selected },
    ])
  );
  return newId;
}

/**
 * Loads the stored file
 * @param {number} id - invoice ID to load
 *
 * @returns {File | null} - File if successfully loaded file, null if file did
 * not exist
 */
export function loadFile(id: number): File | null {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");

  const result = files.find((x) => x.id === id);
  if (result === undefined || result.file === null) {
    return null;
  }

  return new File([new Blob([result.file])], "loaded.csv");
}

/**
 * Deletes the stored invoice
 *
 * @param {number} id - invoice ID to delete
 */
export function deleteInvoice(id: number): void {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");

  localStorage.setItem(
    SAVE_FILE_KEY,
    JSON.stringify(files.filter((x) => x.id !== id))
  );
}

/**
 * Adds rendered UBL to an invoice
 *
 * @param {number} id - invoice ID to set UBL of
 * @param {string | undefined} ubl - UBL string to save or undefined to clear
 */
export function setUBL(ubl: string | undefined, id: number): void {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");
  const invoice = files.find((x) => x.id === id);
  invoice.ubl = ubl;
  localStorage.setItem(SAVE_FILE_KEY, JSON.stringify(files));
}

/**
 * Loads the stored UBL
 *
 * @param {number} id - invoice ID to load from
 *
 * @returns {string | null} - UBL string if successfully loaded, null if ubl did
 * not exist
 */
export function loadUBL(id: number): string | null {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");

  const result = files.find((x) => x.id === id);
  if (result === undefined || result.ubl === undefined) {
    return null;
  }

  return result.ubl;
}

interface AllFields {
  fieldStates: Record<string, string>;
  dropdownOptions: string[];
  selectedRange: MultiSelectRange;
  hasHeaders: boolean;
}

/**
 * Saves the field states
 *
 * @param {number} id - invoice ID to set to
 * @param {AllFields} states - Field states
 */
export function setFieldStates(states: AllFields, id: number): void {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");
  const invoice = files.find((x) => x.id === id);
  invoice.states = states;
  localStorage.setItem(SAVE_FILE_KEY, JSON.stringify(files));
}

/**
 * Loads the stored field states
 *
 * @param {number} id - invoice ID to load from
 *
 * @returns {AllFields | null} - Field states or null if
 * they are not in storage
 */
export function loadFieldStates(id: number): AllFields | null {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");

  const result = files.find((x) => x.id === id);
  if (result === undefined || result.file === undefined) {
    return null;
  }

  return result.states;
}

/**
 * Saves the selected invoice items
 *
 * @param {SelectedData} states - Field states
 */
export function setInvoiceItemsSelection(
  states: SelectedData,
  id: number
): void {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");
  const invoice = files.find((x) => x.id === id);
  invoice.selected = states;
  localStorage.setItem(SAVE_FILE_KEY, JSON.stringify(files));
}

/**
 * Loads the stored field states
 *
 * @param {number} id - invoice ID to set
 *
 * @returns {SelectedData | null} - Field states or null if
 * they are not in storage
 */
export async function loadInvoiceItemsSelection(
  id: number
): Promise<SelectedData | null> {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");

  const result = files.find((x) => x.id === id);
  if (result === undefined || result.file === undefined) {
    return null;
  }

  return result.selected;
}

interface InvoiceSummary {
  customer: string;
  amountDue: string;
  issueDate: string;
  dueDate: string;
  paid: boolean;
}

/**
 * Get all invoices
 *
 * @returns {} - Field states or null if
 * they are not in storage
 */
export function getInvoices(): InvoiceSummary[] {
  const files = JSON.parse(localStorage.getItem(SAVE_FILE_KEY) || "[]");
  return files.map((file) => {
    let result = {
      id: file.id,
      customer: "Not yet selected",
      amountDue: "",
      issueDate: "",
      dueDate: "",
      paid: false,
    };
    if (file.ubl) {
      const ublObject = ublToJSON(file.ubl);
      const party = ublObject["AccountingCustomerParty"]["Party"];
      result.customer =
        (party["PartyName"] ? party["PartyName"]["Name"] : undefined) ||
        party["PartyLegalEntity"]["RegistrationName"];
      result.amountDue = formatCurrency(
        ublObject["LegalMonetaryTotal"]["PayableAmount"]
      );
      result.issueDate = ublObject["IssueDate"];
      result.dueDate = ublObject["DueDate"];
    } else if (file.states !== null) {
      const fields = file.states.fieldStates;
      result.customer = fields["to_party_name"];
      if (fields["item_quantity"] !== "" && fields["item_unit_price"] !== "") {
        const qtyIndex = file.states.dropdownOptions.indexOf(
          fields["item_quantity"]
        );
        const priceIndex = file.states.dropdownOptions.indexOf(
          fields["item_unit_price"]
        );
        const amt =
          (1 + GST_RATE) *
          file.states.selectedRange.data
            .slice(file.states.hasHeaders ? 1 : 0)
            .reduce(
              (p, n) =>
                p + extractNumber(n[priceIndex]) * parseInt(n[qtyIndex]),
              0
            );
        result.amountDue = formatCurrency({
          "_text": amt,
          "$currencyID": "AUD",
        });
      }
      result.issueDate = fields["invoice_issue_date"];
      result.dueDate = fields["invoice_due_date"];
    }
    return result;
  });
}
