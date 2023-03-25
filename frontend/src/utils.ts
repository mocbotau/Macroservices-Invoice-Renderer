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
