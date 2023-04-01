import { JSONValue } from "./interfaces";

const BACKEND_URL = process.env.BACKEND_URL || "http://localhost";
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "3001", 10);
const API_VERSION = "v2";

export class BackendApi {
  static async healthcheck(): Promise<number> {
    return (
      await fetchBackend("/healthcheck", {
        method: "GET",
      })
    ).status;
  }

  static async renderpdf(body: JSONValue): Promise<Response> {
    return await fetchBackend("invoice/render/pdf", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BACKEND_API_KEY,
      },
      body: JSON.stringify(body),
    });
  }

  static async renderhtml(body: JSONValue): Promise<Response> {
    return await fetchBackend("invoice/render/html", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BACKEND_API_KEY,
      },
      body: JSON.stringify(body),
    });
  }

  static async renderjson(body: JSONValue): Promise<Response> {
    return await fetchBackend("invoice/render/json", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "api-key": process.env.BACKEND_API_KEY,
      },
      body: JSON.stringify(body),
    });
  }
}

/**
 * Wrapper for fetch to call backend API routes
 *
 * @param {string} route - backend route to call
 * @param {string} init - standard fetch request parameters
 * @returns {Promise<Response>} - standard fetch response object
 */
const fetchBackend = async (
  route: string,
  init?: RequestInit | undefined
): Promise<Response> => {
  return fetch(
    `${BACKEND_URL}:${BACKEND_PORT}/api/${API_VERSION}/${route}`,
    init
  );
};
