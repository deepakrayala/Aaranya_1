import type { AuthUser } from "./auth";
const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export type Address = { id: string; label: string; address_line1: string; address_line2: string | null; city: string; state: string; postal_code: string; country: string; phone: string };
export type AddressInput = Omit<Address, "id">;
async function request<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`${base}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.error ?? "Unable to update account"); return body as T; }
export const getProfile = () => request<{ user: AuthUser }>("/api/v1/users/me");
export const updateProfile = (name: string) => request<{ user: AuthUser }>("/api/v1/users/me", { method: "PUT", body: JSON.stringify({ name }) });
export const getAddresses = () => request<{ addresses: Address[] }>("/api/v1/users/me/addresses");
export const createAddress = (input: AddressInput) => request<{ address: Address }>("/api/v1/users/me/addresses", { method: "POST", body: JSON.stringify(input) });
export const updateAddress = (id: string, input: AddressInput) => request<{ address: Address }>(`/api/v1/users/me/addresses/${id}`, { method: "PUT", body: JSON.stringify(input) });
export const deleteAddress = (id: string) => request<void>(`/api/v1/users/me/addresses/${id}`, { method: "DELETE" });
