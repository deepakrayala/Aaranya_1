const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type ContactMessageInput = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export type ContactMessage = {
  id: string;
  user_id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  created_at: string;
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
    throw new Error(body?.error ?? "Unable to send message");
  }

  return body as T;
}

export const createContactMessage = (input: ContactMessageInput) =>
  request<{ message: string; contact_message: ContactMessage }>(
    "/api/v1/contact-messages",
    {
      method: "POST",
      body: JSON.stringify(input),
    },
  );
