import { APIResponse, InvoiceSendExtOptions, InvoiceSendOptions } from "@src/interfaces";

export class Api {
  /**
   * Checks the health status of the backend
   * @returns {number} - status code of the health check
   */
  static async healthStatus(): Promise<number> {
    return (
      await fetch("/api/healthcheck", {
        method: "GET",
      })
    ).status;
  }
  /**
   * Logs a user into the app
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async login(email: string, password: string): Promise<APIResponse> {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return { status: res.status, json: await res.json() };
  }
  /**
   * Logs a user out (clears session)
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async logout(): Promise<APIResponse> {
    const res = await fetch("/api/auth/logout", {
      method: "GET",
    });
    return { status: res.status, json: await res.json() };
  }
  /**
   * Registers a user
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async register(email: string, password: string): Promise<APIResponse> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    return { status: res.status, json: await res.json() };
  }

  /**
   * Sends an invoice to an external source
   * @param {string} contact - the recipient's identifier
   * @param {InvoiceSendOptions} type - The medium in which to send the invoice
   * @param {"json"|"pdf"|"html"|"xml"} ext - the extension of the file to send
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async sendInvoice(
    contact: string,
    type: InvoiceSendOptions,
    ext: InvoiceSendExtOptions,
    file: Blob
  ): Promise<APIResponse> {
    const formData = new FormData();
    formData.append("type", type);
    formData.append("contact", contact);
    formData.append("ext", ext);
    formData.append("file", file);
    const res = await fetch("/api/send", {
      method: "POST",
      headers: { "Content-Type": "multipart/form-data" },
      body: formData,
    });
    return { status: res.status, json: await res.json() };
  }
}
