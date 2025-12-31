const ENV_API_URL = process.env.API_BASE_URL || "http://localhost:8080/api/v1";

let apiUrl = ENV_API_URL;
let authHeaders: HeadersInit = {};

try {
  const url = new URL(ENV_API_URL);
  const username = url.username;
  const password = url.password;

  if (username || password) {
    url.username = "";
    url.password = "";
    apiUrl = url.toString().replace(/\/$/, "");

    // We strictly use Basic auth if username/password are present
    authHeaders = {
      Authorization: `Basic ${btoa(`${username}:${password}`)}`,
    };
  } else {
    apiUrl = ENV_API_URL.replace(/\/$/, "");
  }
} catch (e) {
  // Fallback if URL parsing fails
  console.warn("Failed to parse API_BASE_URL", e);
  apiUrl = ENV_API_URL.replace(/\/$/, "");
}

export const API_BASE_URL = apiUrl;
export const API_AUTH_HEADERS = authHeaders;
