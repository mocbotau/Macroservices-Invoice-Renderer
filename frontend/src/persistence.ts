/**
 * Saves a file locally
 *
 * @param {File} f - File to save
 */
export async function saveFile(f: File): Promise<void> {
  const fText = await f.text();

  localStorage.setItem("macroservices-save-file", fText);
}

/**
 * Loads the stored file
 *
 * @returns {File | null} - File if successfully loaded file, null if file did
 * not exist
 */
export async function loadFile(): Promise<File | null> {
  const fText = localStorage.getItem("macroservices-save-file");

  if (fText === null) {
    return null;
  }

  return new File([new Blob([fText])], "loaded.csv");
}

/**
 * Saves UBL locally
 *
 * @param {string} ubl - UBL to save
 */
export async function saveUBL(ubl: string): Promise<void> {
  localStorage.setItem("macroservices-save-ubl", ubl);
}

/**
 * Loads the stored UBL
 *
 * @returns {string | null} - UBL string if successfully loaded, null if ubl did
 * not exist
 */
export async function loadUBL(): Promise<string | null> {
  const ubl = localStorage.getItem("macroservices-save-ubl");

  return ubl;
}
