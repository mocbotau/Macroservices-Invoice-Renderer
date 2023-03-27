import { NextApiRequest } from "next";

/**
 * Prompts the user to upload a file
 *
 * @param {string} fileType - file type to upload (eg ".csv")
 * @returns {Promise<File>} - uploaded file
 */
export async function uploadFile(fileType: string): Promise<File> {
  return new Promise((res) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = fileType;

    input.onchange = (e) => {
      if (!e || !e.target) {
        return;
      }
      const target = e.target as HTMLInputElement;
      if (!target.files) {
        return;
      }
      const file = target.files[0];

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
