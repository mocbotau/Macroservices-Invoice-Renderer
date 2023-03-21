export class Api {
  static async healthStatus(): Promise<number> {
    return (
      await fetch("/api/healthcheck", {
        method: "GET",
      })
    ).status;
  }
}
