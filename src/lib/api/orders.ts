const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export const orderStatuses = {
  1: "Pending payment",
  2: "Paid",
  3: "Processing",
  4: "Shipped",
  5: "Delivered",
  6: "Cancelled",
  7: "Refunded",
} as const;

export type OrderStatus = keyof typeof orderStatuses;

export type OrderItem = {
  id: string;
  order_id: string;
  product_id: string;
  product_name: string;
  sku: string;
  price_paise: number;
  quantity: number;
  created_at: string;
};

export type Order = {
  id: string;
  order_number: number;
  user_id: string;
  total_amount_paise: number;
  status: OrderStatus;
  shipping_name: string;
  shipping_address_line1: string;
  shipping_address_line2: string | null;
  shipping_city: string;
  shipping_state: string;
  shipping_postal_code: string;
  shipping_country: string;
  shipping_phone: string;
  billing_name: string;
  billing_address_line1: string;
  billing_address_line2: string | null;
  billing_city: string;
  billing_state: string;
  billing_postal_code: string;
  billing_country: string;
  billing_phone: string;
  item_count?: number;
  item_summary?: string;
  created_at: string;
  updated_at: string;
};

export type AdminOrder = Order & {
  customer_name: string;
  customer_email: string;
};

type CreateOrderInput = {
  items: { product_id: string; quantity: number }[];
  shipping_address_id: string;
  billing_address_id: string;
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Unable to load orders");
  return body as T;
}

export const createOrder = (input: CreateOrderInput) =>
  request<{ order: Order; items: OrderItem[] }>("/api/v1/orders", { method: "POST", body: JSON.stringify(input) });
export const getOrders = () => request<{ orders: Order[] }>("/api/v1/orders");
export const getOrder = (id: string) => request<{ order: Order; items: OrderItem[] }>(`/api/v1/orders/${id}`);
export const getAdminOrders = () => request<{ orders: AdminOrder[] }>("/api/v1/admin/orders");
export const getAdminOrder = (id: string) =>
  request<{ order: AdminOrder; items: OrderItem[] }>(`/api/v1/admin/orders/${id}`);
export const updateAdminOrderStatus = (id: string, status: OrderStatus) =>
  request<{ order: Order }>(`/api/v1/admin/orders/${id}/status`, {
    method: "PUT",
    body: JSON.stringify({ status }),
  });
