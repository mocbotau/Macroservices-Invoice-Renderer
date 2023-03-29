import { NextApiRequest } from "next";
import { invoiceOptions } from "./components/csvConfiguration/csvConfigurationFields";

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
 * Returns the corresponding letter of the alphabet given a number, starting from 0
 *
 * @param {number} num - the number to convert
 * @returns {string} - the returned letter
 */
export function charFromNumber(num: number): string {
  return String.fromCharCode("A".charCodeAt(0) + num);
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
  return `${charFromNumber(startCol)}${startRow + 1}:${charFromNumber(endCol)}${
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
 * Sets the required fields state to true if there are some required fields that are empty
 *
 * @param {Record<string, string>} stateObject - the object holding the values of all text field components
 * @param {Function} setShowRequired - the set state for required fields
 * @param {Function} setShowSnackbar - the set state for the snackbar
 */
export function checkRequiredFields(
  stateObject: Record<string, string>,
  setShowRequired: (value: boolean) => void,
  setShowSnackbar: (value: boolean) => void
): void {
  const res = requiredFields.some((field) => {
    return stateObject[field].length === 0;
  });
  setShowRequired(res);
  setShowSnackbar(res);
}
