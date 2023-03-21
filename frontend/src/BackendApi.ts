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
