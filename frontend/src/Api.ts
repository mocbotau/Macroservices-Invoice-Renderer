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
    language: string
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
    language: string
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
}
