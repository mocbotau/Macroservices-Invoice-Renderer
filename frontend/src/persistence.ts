import {
  FIELD_STATES_KEY,
  SAVE_FILE_KEY,
  SAVE_UBL_KEY,
  SELECTED_INVOICE_ITEMS_KEY,
} from "./constants";
import { MultiSelectRange, SelectedData } from "./interfaces";

/**
 * Saves a file locally
 *
 * @param {File} f - File to save
 */
export async function saveFile(f: File): Promise<void> {
  const fText = await f.text();

  localStorage.setItem(SAVE_FILE_KEY, fText);
}

/**
 * Loads the stored file
 *
 * @returns {File | null} - File if successfully loaded file, null if file did
 * not exist
 */
export async function loadFile(): Promise<File | null> {
  const fText = localStorage.getItem(SAVE_FILE_KEY);

  if (fText === null) {
    return null;
  }

  return new File([new Blob([fText])], "loaded.csv");
}

/**
 * Clears the stored file
 */
export async function clearFile(): Promise<void> {
  localStorage.removeItem(SAVE_FILE_KEY);
}

/**
 * Saves UBL locally
 *
 * @param {string} ubl - UBL to save
 */
export async function saveUBL(ubl: string): Promise<void> {
  localStorage.setItem(SAVE_UBL_KEY, ubl);
}

/**
 * Loads the stored UBL
 *
 * @returns {string | null} - UBL string if successfully loaded, null if ubl did
 * not exist
 */
export async function loadUBL(): Promise<string | null> {
  const ubl = localStorage.getItem(SAVE_UBL_KEY);

  return ubl;
}

/**
 * Clears the stored UBL
 */
export async function clearUBL(): Promise<void> {
  localStorage.removeItem(SAVE_UBL_KEY);
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
 * @param {AllFields} states - Field states
 */
export async function saveFieldStates(states: AllFields): Promise<void> {
  localStorage.setItem(FIELD_STATES_KEY, JSON.stringify(states));
}

/**
 * Loads the stored field states
 *
 * @returns {Promise<AllFields | null>} - Field states or null if
 * they are not in storage
 */
export async function loadFieldStates(): Promise<AllFields | null> {
  const fStates = localStorage.getItem(FIELD_STATES_KEY);

  if (fStates === null) {
    return null;
  }

  return JSON.parse(fStates);
}

/**
 * Clears the stored file
 */
export async function clearFieldStates(): Promise<void> {
  localStorage.removeItem(FIELD_STATES_KEY);
}

/**
 * Saves the selected invoice items
 *
 * @param {SelectedData} states - Field states
 */
export async function saveInvoiceItemsSelection(
  states: SelectedData
): Promise<void> {
  localStorage.setItem(SELECTED_INVOICE_ITEMS_KEY, JSON.stringify(states));
}

/**
 * Loads the stored field states
 *
 * @returns {Promise<SelectedData | null>} - Field states or null if
 * they are not in storage
 */
export async function loadInvoiceItemsSelection(): Promise<SelectedData | null> {
  const states = localStorage.getItem(SELECTED_INVOICE_ITEMS_KEY);

  if (states === null) {
    return null;
  }

  return JSON.parse(states);
}

/**
 * Clears the stored file
 */
export async function clearInvoiceItemsSelection(): Promise<void> {
  localStorage.removeItem(SELECTED_INVOICE_ITEMS_KEY);
}
