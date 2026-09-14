const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type AdminContactMessage = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
  account_name: string | null;
  account_email: string | null;
};

async function request<T>(
  path: string,
  options: RequestInit = {},
): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  const body = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(body?.error ?? "Unable to load messages");
  }

  return body as T;
}

export async function getAdminContactMessages(): Promise<{
  messages: AdminContactMessage[];
}> {
  return request<{ messages: AdminContactMessage[] }>(
    "/api/v1/admin/contact-messages",
  );
}
