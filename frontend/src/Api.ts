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
   * @returns {Response} - Fetch Response
   */
  static async login(email: string, password: string): Promise<Response> {
    return await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }
  /**
   * Logs a user out (clears session)
   * @returns {Response} - Fetch Response
   */
  static async logout(): Promise<Response> {
    return await fetch("/api/auth/logout", {
      method: "GET",
    });
  }
  /**
   * Registers a user
   * @returns {Response} - Fetch Response
   */
  static async register(email: string, password: string): Promise<Response> {
    return await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
  }
}
