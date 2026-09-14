const base = import.meta.env.VITE_API_URL ?? "http://localhost:4000";

export type Paise = number | string;

export type AdminDashboardMetrics = {
  customers: number;
  products: number;
  orders: number;
  revenue_paise: Paise;
  pending_orders: number;
  delivered_orders: number;
  low_stock_products: number;
};

export type AdminDashboardOrder = {
  id: string;
  order_number: number;
  total_amount_paise: number;
  status: number;
  shipping_city: string;
  created_at: string;
  customer_name: string;
  customer_email: string;
  item_count: number;
};

export type AdminTopProduct = {
  product_id: string;
  name: string;
  sku: string;
  quantity_sold: number;
  revenue_paise: Paise;
};

export type AdminDashboardResponse = {
  metrics: AdminDashboardMetrics;
  recent_orders: AdminDashboardOrder[];
  top_products: AdminTopProduct[];
  revenue_definition: string;
};

export type AdminCustomer = {
  id: string;
  name: string;
  email: string;
  role: 2;
  created_at: string;
  order_count: number;
  total_spent_paise: Paise;
  last_order_at: string | null;
  city: string;
  tier: "New" | "Returning" | "VIP";
};

export type AdminCustomersResponse = {
  customers: AdminCustomer[];
};

export type AdminAnalyticsStatus = {
  status: number;
  label: string;
  count: number;
};

export type AdminRevenuePoint = {
  d: string;
  orders: number;
  revenue_paise: Paise;
};

export type AdminCategoryPerformance = {
  category_name: string;
  quantity_sold: number;
  revenue_paise: Paise;
};

export type AdminAnalyticsResponse = {
  range_days: 7 | 30 | 90;
  revenue_series: AdminRevenuePoint[];
  status_distribution: AdminAnalyticsStatus[];
  top_products: AdminTopProduct[];
  category_performance: AdminCategoryPerformance[];
  revenue_definition: string;
};

async function adminRequest<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${base}${path}`, {
    ...options,
    credentials: "include",
    headers: { "Content-Type": "application/json", ...options.headers },
  });
  const body = await response.json().catch(() => null);
  if (!response.ok) throw new Error(body?.error ?? "Unable to load admin data");
  return body as T;
}

export function paiseToNumber(value: Paise): number {
  return typeof value === "number" ? value : Number.parseInt(value, 10) || 0;
}

export const formatINRPaise = (paise: Paise) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(
    paiseToNumber(paise) / 100,
  );

export const getAdminDashboard = () => adminRequest<AdminDashboardResponse>("/api/v1/admin/dashboard");

export function getAdminCustomers(input: { search?: string; tier?: string } = {}) {
  const params = new URLSearchParams();
  if (input.search) params.set("search", input.search);
  if (input.tier && input.tier !== "All") params.set("tier", input.tier);
  return adminRequest<AdminCustomersResponse>(`/api/v1/admin/customers${params.size ? `?${params}` : ""}`);
}

export const getAdminAnalytics = (range: 7 | 30 | 90 = 30) =>
  adminRequest<AdminAnalyticsResponse>(`/api/v1/admin/analytics?range=${range}`);
