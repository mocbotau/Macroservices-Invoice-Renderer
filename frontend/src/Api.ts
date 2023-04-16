import {
  APIResponse,
  InvoiceSendExtOptions,
  InvoiceSendOptions,
} from "@src/interfaces";

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
   * Renders UBL to a PDF
   * @param ubl - UBL file to render
   */
  static async renderToPDF(
    ubl: string,
    style: number,
    language: string,
    optional: {
      [prop: string]: string;
    }
  ): Promise<{ status: number; blob: Blob }> {
    const resp = await fetch("/api/renderpdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ubl,
        style,
        language,
        optional,
      }),
    });

    return {
      status: resp.status,
      blob: await resp.blob(),
    };
  }

  /**
   * Renders UBL to a HTML
   * @param ubl - UBL file to render
   */
  static async renderToHTML(
    ubl: string,
    style: number,
    language: string,
    optional: {
      [prop: string]: string;
    }
  ): Promise<{ status: number; blob: Blob }> {
    const resp = await fetch("/api/renderhtml", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ubl,
        style,
        language,
        optional,
      }),
    });

    return {
      status: resp.status,
      blob: await resp.blob(),
    };
  }

  /**
   * Renders UBL to a JSON
   * @param ubl - UBL file to render
   */
  static async renderToJSON(
    ubl: string
  ): Promise<{ status: number; blob: Blob }> {
    const resp = await fetch("/api/renderjson", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ubl,
      }),
    });

    return {
      status: resp.status,
      blob: await resp.blob(),
    };
  }

  /**
   * Sends a password reset link to the email provided. Always returns a 202 as to not expose whether the account exists
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async requestResetPassword(email: string): Promise<APIResponse> {
    const res = await fetch("/api/reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    return { status: res.status, json: await res.json() };
  }
  /**
   * Given a code, reset the users' password
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async resetPassword(
    code: string,
    password: string
  ): Promise<APIResponse> {
    const res = await fetch(`/api/reset/${code}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });
    return { status: res.status, json: await res.json() };
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
   * Registers a user
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */
  static async register(
    email: string,
    password: string,
    name: string
  ): Promise<APIResponse> {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, name }),
    });
    console.log("a", res);
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
      body: formData,
    });
    return { status: res.status, json: await res.json() };
  }

  /**
   * Sends an XML invoice to an external source
   * @param {string} contact - the recipient's identifier
   * @param {InvoiceSendOptions} type - The medium in which to send the invoice
   * @param {string} xml - the UBL data to send
   * @returns {Promise<APIResponse>} - The status and JSON of the return
   */

  static async sendInvoiceExternal(
    contact: string,
    type: InvoiceSendOptions,
    xml: string
  ): Promise<APIResponse> {
    const res = await fetch(`${process.env.SENDING_API_URL}/${type}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        recipients: contact,
        xmlString: xml,
        subject: "Macroservices Invoice Rendering",
        message: "You've received an invoice!",
        format: "json",
      }),
    });
    if (res.status !== 200) {
      return { status: res.status, json: {} };
    }
    return { status: res.status, json: await res.json() };
  }
}
