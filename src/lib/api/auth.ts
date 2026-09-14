export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 1 | 2;
};

type AuthResponse = {
  user: AuthUser;
};

export class AuthApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
  }
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  let response: Response;

  try {
    response = await fetch(`${apiBaseUrl}${path}`, {
      ...options,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });
  } catch {
    throw new Error("Unable to reach Aranya. Please try again shortly.");
  }

  const body = (await response.json().catch(() => null)) as { error?: string } | T | null;

  if (!response.ok) {
    const message =
      body && typeof body === "object" && "error" in body && typeof body.error === "string"
        ? body.error
        : "Something went wrong. Please try again.";
    throw new AuthApiError(message, response.status);
  }

  return body as T;
}

export function signup(input: { name: string; email: string; password: string }): Promise<AuthResponse> {
  return request("/api/v1/auth/signup", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function login(input: { email: string; password: string }): Promise<AuthResponse> {
  return request("/api/v1/auth/login", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function logout(): Promise<void> {
  return request("/api/v1/auth/logout", { method: "POST" });
}

export async function getCurrentUser(): Promise<AuthUser> {
  const response = await request<AuthResponse>("/api/v1/auth/me");
  return response.user;
}
