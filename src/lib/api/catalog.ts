const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";
export type Category = { id: string; name: string; slug: string };
export type CatalogProduct = { id: string; category_id: string; sku: string; slug: string; name: string; description: string; price_paise: number; original_price_paise: number | null; stock_quantity: number; status: 1 | 2 | 3; rating: number | null; image_url: string | null; category_name: string; category_slug: string };
export class CatalogApiError extends Error {
	constructor(message: string, readonly status: number) {
		super(message);
		this.name = "CatalogApiError";
	}
}
async function get<T>(path: string): Promise<T> { const response = await fetch(`${base}${path}`, { credentials: "include" }); const body = await response.json(); if (!response.ok) throw new CatalogApiError(body.error ?? "Unable to load catalog", response.status); return body; }
export const getCategories = () => get<{ categories: Category[] }>("/api/v1/categories");
export const getProducts = (category?: string) => get<{ products: CatalogProduct[] }>(`/api/v1/products${category ? `?category=${encodeURIComponent(category)}` : ""}`);
export const getProduct = (slug: string) => get<{ product: CatalogProduct }>(`/api/v1/products/${encodeURIComponent(slug)}`);
export type ProductInput = Pick<CatalogProduct, "category_id" | "sku" | "slug" | "name" | "description" | "price_paise" | "original_price_paise" | "stock_quantity" | "status" | "rating" | "image_url">;
async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> { const response = await fetch(`${base}${path}`, { ...options, credentials: "include", headers: { "Content-Type": "application/json", ...options.headers } }); const body = await response.json().catch(() => null); if (!response.ok) throw new Error(body?.error ?? "Unable to update product"); return body as T; }
export const getAdminProducts = () => adminRequest<{ products: CatalogProduct[] }>("/api/v1/admin/products");
export const createAdminProduct = (input: ProductInput) => adminRequest<{ product: CatalogProduct }>("/api/v1/admin/products", { method: "POST", body: JSON.stringify(input) });
export const updateAdminProduct = (id: string, input: ProductInput) => adminRequest<{ product: CatalogProduct }>(`/api/v1/admin/products/${id}`, { method: "PUT", body: JSON.stringify(input) });
export const deleteAdminProduct = (id: string) => adminRequest<void>(`/api/v1/admin/products/${id}`, { method: "DELETE" });
export const createCategory = (input: Pick<Category, "name" | "slug">) => adminRequest<{ category: Category }>("/api/v1/admin/categories", { method: "POST", body: JSON.stringify(input) });
export const updateCategory = (id: string, input: Pick<Category, "name" | "slug">) => adminRequest<{ category: Category }>(`/api/v1/admin/categories/${id}`, { method: "PUT", body: JSON.stringify(input) });
export const deleteCategory = (id: string) => adminRequest<void>(`/api/v1/admin/categories/${id}`, { method: "DELETE" });
