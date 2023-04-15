import { SAVE_FILE_KEY, SAVE_UBL_KEY } from "./constants";

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
