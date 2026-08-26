const BACKEND_API_URL = process.env.BACKEND_API_URL;
const LANDING_SECRET = process.env.LANDING_SECRET;

function getBaseUrl(): string {
  if (!BACKEND_API_URL) {
    throw new Error("Missing BACKEND_API_URL environment variable");
  }

  return BACKEND_API_URL.endsWith("/")
    ? BACKEND_API_URL.slice(0, -1)
    : BACKEND_API_URL;
}

type FetchOptions = Omit<RequestInit, "headers"> & {
  headers?: HeadersInit;
};

export async function fetchFromBackend<T = unknown>(
  path: string,
  options: FetchOptions = {}
): Promise<T> {
  const baseUrl = getBaseUrl();
  const url = path.startsWith("http")
    ? path
    : `${baseUrl}${path.startsWith("/") ? path : `/${path}`}`;

  const headers = new Headers(options.headers);

  if (!LANDING_SECRET) {
    console.warn(
      "[apiClient] Missing LANDING_SECRET environment variable. Request might fail."
    );
  } else {
    headers.set("landing-secret", LANDING_SECRET);
  }
  headers.set("Content-Type", "application/json");

  const response = await fetch(url, {
    cache: "no-store",
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error(
      `[apiClient] Request failed (${response.status} ${response.statusText})`
    );
  }

  return (await response.json()) as T;
}

