import { NextApiRequest } from "next";
import { invoiceOptions } from "./components/csvConfiguration/csvConfigurationFields";
import { INVOICE_ITEMS } from "./constants";

/**
 * Prompts the user to upload a file
 *
 * @param {string} fileType - file type to upload (eg ".csv")
 * @returns {Promise<File>} - uploaded file
 */
export async function uploadFile(fileType: string): Promise<File | string> {
  return new Promise((res) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = fileType;

    input.onchange = (e) => {
      if (!e || !e.target) {
        return res("Something went wrong. Please try again.");
      }
      const target = e.target as HTMLInputElement;
      if (!target.files) {
        return res("Something went wrong. Please try again.");
      }
      const file = target.files[0];
      if (!file.name.match(/(^[\w.]+)?\.csv$/)) {
        return res("Please upload a valid .csv file.");
      }

      res(file);
    };

    input.click();
  });
}

/**
 * Reads a file to text
 *
 * @param {File} file - file to read
 * @returns {Promise<string>} - string that is read
 */
export async function readFileAsText(file: File): Promise<string> {
  return new Promise((res, rej) => {
    const reader = new FileReader();

    reader.onload = (evt) => {
      if (!evt.target) return;
      if (evt.target.readyState !== 2) return;
      if (evt.target.error) {
        rej(evt.target.error);
        return;
      }

      res(evt.target.result as string);
    };

    reader.readAsText(file);
  });
}

export function getSession(req: NextApiRequest) {
  return process.env.NODE_ENV !== "test"
    ? req.session
    : {
        user: {},
        destroy: () => Promise.resolve(),
        save: () => Promise.resolve(),
      };
}

/**
 * Returns the corresponding spreadsheet column name based on an inputted number
 * Code retrieved from https://stackoverflow.com/questions/8240637/convert-numbers-to-letters-beyond-the-26-character-alphabet
 * Written by Christopher Young
 *
 * @param {number} num - the number to convert
 * @returns {string} - the returned letter
 */
export function colFromNumber(num: number): string {
  const m = num % 26;
  const c = String.fromCharCode(65 + m);
  const r = num - m;
  return r > 0 ? `${colFromNumber((r - 1) / 26)}${c}` : c;
}

/**
 * Returns the column number from a corresponding spreadsheet column name
 * Code retrieved from https://stackoverflow.com/questions/9905533/convert-excel-column-alphabet-e-g-aa-to-number-e-g-25
 * Written by cuixiping
 *
 * @param {string} colName - the string to convert
 * @returns {number} - the returned column, returns 0 if there is no string
 */
export function lettersToNumber(colName: string): number {
  if (colName.length === 0) return 0;
  return colName.split("").reduce((r, a) => r * 26 + parseInt(a, 36) - 9, 0);
}

/**
 * Returns the cell range reference given cell range coordinates
 * @param {number} startRow
 * @param {number} startCol
 * @param {number} endRow
 * @param {number} endCol
 * @returns {string} - the cell range reference
 */
export function convertToCellRefs(
  startRow: number,
  startCol: number,
  endRow: number,
  endCol: number
): string {
  if (startRow === -1 || startCol === -1 || endRow === -1 || endCol === -1)
    return "";
  return `${colFromNumber(startCol)}${startRow + 1}:${colFromNumber(endCol)}${
    endRow + 1
  }`;
}

/**
 * Given an index, check if it is out of bound. It will return the max index if it exceeds the max
 * index, 0 if lower than 0, otherwise returns the original index.
 *
 * @param {number} index - the index to check
 * @param {number} maxIndex - the greatest index of the array
 * @returns {number} - the result
 */
export function checkBoundaries(index: number, maxIndex: number): number {
  if (index < 0) return 0;
  if (index > maxIndex) return maxIndex;
  return index;
}

/**
 * Takes the invoice options data structure and reduces it
 * to contain only the IDs of the text fields, and an empty
 * value for a text state.
 * @returns {Record<string, string>} - the new object
 */
export function createTextStateObject(): Record<string, string> {
  const tempItems: string[][] = [];

  invoiceOptions.forEach((category) => {
    category.items.forEach((item) => {
      if (category.id === "invoice_parties") {
        tempItems.push([`from_${item.id}`, ""], [`to_${item.id}`, ""]);
      } else {
        tempItems.push([item.id, ""]);
      }
    });
  });

  return Object.fromEntries(tempItems);
}

/**
 * Returns all the IDs of the item fields with blank values for resetting
 *
 * @returns {string[][]} - all the IDs
 */
export function getInvoiceItemIDs(): string[][] {
  return invoiceOptions[INVOICE_ITEMS].items.map((item) => {
    return [item.id, ""];
  });
}

/**
 * Returns all the IDs of the item fields that will cause another field to be required
 * @param {string} field - the field to check
 * @param {number} category - the category to pull data from
 * @returns {string[]} - all the IDs
 */
export function getDependentRequiredFields(
  field: string,
  category: number
): string[] {
  const res: string[] = [];
  invoiceOptions[category].items.forEach((item) => {
    if (item.dependent === field) {
      res.push(item.id);
    }
  });

  return res;
}

/**
 * Given a string, it extracts any dollar signs, and checks if the string is a number
 *
 * @param {string} input - the string to return a number from
 * @returns {number} - returns 0 if not a number, otherwise returns the number
 */
export function extractNumber(input: string): number {
  const tmp = Number(input.replace("$", ""));
  return isNaN(tmp) ? 0 : tmp;
}
