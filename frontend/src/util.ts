const BACKEND_URL = process.env.BACKEND_URL || "http://localhost";
const BACKEND_PORT = parseInt(process.env.BACKEND_PORT || "3001", 10);

export function fetchBackend(route: string, init?: RequestInit | undefined) {
  console.log(process.env);
  return fetch(`${BACKEND_URL}:${BACKEND_PORT}${route}`, init);
}
