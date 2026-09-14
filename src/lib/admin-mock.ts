// Mock dataset for the Aranya admin panel.
// In-memory only; safe to mutate from React state.

export type ProductCategory =
  | "Powders"
  | "Premixes"
  | "Tonics"
  | "Tablets"
  | "Snacks"
  | "Gummies";

export type ProductStatus = "Live" | "Draft" | "Low stock" | "Out of stock";

export type Product = {
  id: string;
  sku: string;
  name: string;
  category: ProductCategory;
  price: number; // INR
  cost: number;
  stock: number;
  sold30d: number;
  status: ProductStatus;
  rating: number;
  createdAt: string;
};

export type OrderStatus = "Paid" | "Processing" | "Shipped" | "Delivered" | "Refunded";

export type Order = {
  id: string;
  customer: string;
  email: string;
  total: number;
  items: number;
  status: OrderStatus;
  channel: "Web" | "Mobile" | "Wholesale";
  city: string;
  date: string;
};

export type Customer = {
  id: string;
  name: string;
  email: string;
  city: string;
  tier: "New" | "Returning" | "VIP";
  orders: number;
  ltv: number; // INR
  lastOrder: string;
};

export type SitePage = {
  slug: string;
  title: string;
  status: "Published" | "Draft";
  views30d: number;
  avgTime: string;
  bounce: number;
  updatedAt: string;
};

export const products: Product[] = [
  { id: "p_001", sku: "ARA-TRP-060", name: "Triphala Morning Premix", category: "Premixes", price: 1290, cost: 410, stock: 184, sold30d: 312, status: "Live", rating: 4.9, createdAt: "2025-09-12" },
  { id: "p_002", sku: "ARA-ASH-030", name: "Ashwagandha Vitality Oil", category: "Tonics", price: 2490, cost: 780, stock: 42, sold30d: 218, status: "Low stock", rating: 4.8, createdAt: "2025-08-04" },
  { id: "p_003", sku: "ARA-TLS-012", name: "Tulsi Amber Tonic", category: "Tonics", price: 990, cost: 280, stock: 312, sold30d: 401, status: "Live", rating: 4.7, createdAt: "2025-07-22" },
  { id: "p_004", sku: "ARA-BRH-030", name: "Brahmi Stillness Tablet", category: "Tablets", price: 1490, cost: 420, stock: 0, sold30d: 96, status: "Out of stock", rating: 4.9, createdAt: "2025-06-18" },
  { id: "p_005", sku: "ARA-MOR-150", name: "Moringa Daily Powder", category: "Powders", price: 890, cost: 240, stock: 220, sold30d: 174, status: "Live", rating: 4.6, createdAt: "2025-05-30" },
  { id: "p_006", sku: "ARA-AML-090", name: "Amla Glow Gummies", category: "Gummies", price: 690, cost: 190, stock: 510, sold30d: 502, status: "Live", rating: 4.8, createdAt: "2025-10-02" },
  { id: "p_007", sku: "ARA-MAK-200", name: "Makhana Roasted Snack", category: "Snacks", price: 320, cost: 110, stock: 88, sold30d: 145, status: "Live", rating: 4.5, createdAt: "2025-04-11" },
  { id: "p_008", sku: "ARA-SHT-100", name: "Shatavari Bloom Powder", category: "Powders", price: 1190, cost: 360, stock: 12, sold30d: 64, status: "Low stock", rating: 4.7, createdAt: "2025-03-08" },
  { id: "p_009", sku: "ARA-CRM-030", name: "Curcumin Forte Tablet", category: "Tablets", price: 1690, cost: 510, stock: 0, sold30d: 0, status: "Draft", rating: 0, createdAt: "2026-04-22" },
];

export const orders: Order[] = [
  { id: "ORD-10921", customer: "Aanya Mehta", email: "aanya@river.co", total: 5490, items: 4, status: "Paid", channel: "Web", city: "Mumbai", date: "2026-05-13" },
  { id: "ORD-10920", customer: "Rohan Pillai", email: "rohan@northlight.in", total: 1290, items: 1, status: "Shipped", channel: "Web", city: "Bengaluru", date: "2026-05-13" },
  { id: "ORD-10919", customer: "Ishita Sharma", email: "ishita@cloud.dev", total: 3380, items: 3, status: "Processing", channel: "Mobile", city: "Pune", date: "2026-05-12" },
  { id: "ORD-10918", customer: "Verdant Cafés", email: "buyer@verdant.co", total: 24890, items: 28, status: "Paid", channel: "Wholesale", city: "Goa", date: "2026-05-12" },
  { id: "ORD-10917", customer: "Kabir Nair", email: "kabir@studio.in", total: 990, items: 1, status: "Delivered", channel: "Web", city: "Kochi", date: "2026-05-11" },
  { id: "ORD-10916", customer: "Meera Iyer", email: "meera@lab.org", total: 2480, items: 2, status: "Refunded", channel: "Web", city: "Chennai", date: "2026-05-10" },
  { id: "ORD-10915", customer: "Arjun Sethi", email: "arjun@stone.studio", total: 1690, items: 2, status: "Delivered", channel: "Mobile", city: "Delhi", date: "2026-05-10" },
  { id: "ORD-10914", customer: "Tara Krishnan", email: "tara@quiet.in", total: 4890, items: 5, status: "Shipped", channel: "Web", city: "Hyderabad", date: "2026-05-09" },
];

export const customers: Customer[] = [
  { id: "c_01", name: "Aanya Mehta", email: "aanya@river.co", city: "Mumbai", tier: "VIP", orders: 14, ltv: 68900, lastOrder: "2026-05-13" },
  { id: "c_02", name: "Rohan Pillai", email: "rohan@northlight.in", city: "Bengaluru", tier: "Returning", orders: 6, ltv: 18420, lastOrder: "2026-05-13" },
  { id: "c_03", name: "Ishita Sharma", email: "ishita@cloud.dev", city: "Pune", tier: "Returning", orders: 4, ltv: 9870, lastOrder: "2026-05-12" },
  { id: "c_04", name: "Verdant Cafés", email: "buyer@verdant.co", city: "Goa", tier: "VIP", orders: 22, ltv: 412000, lastOrder: "2026-05-12" },
  { id: "c_05", name: "Kabir Nair", email: "kabir@studio.in", city: "Kochi", tier: "New", orders: 1, ltv: 990, lastOrder: "2026-05-11" },
  { id: "c_06", name: "Meera Iyer", email: "meera@lab.org", city: "Chennai", tier: "Returning", orders: 5, ltv: 14820, lastOrder: "2026-05-10" },
  { id: "c_07", name: "Arjun Sethi", email: "arjun@stone.studio", city: "Delhi", tier: "Returning", orders: 3, ltv: 6090, lastOrder: "2026-05-10" },
  { id: "c_08", name: "Tara Krishnan", email: "tara@quiet.in", city: "Hyderabad", tier: "VIP", orders: 11, ltv: 52400, lastOrder: "2026-05-09" },
];

export const sitePages: SitePage[] = [
  { slug: "/", title: "Home — Founders' Edition", status: "Published", views30d: 48210, avgTime: "01:42", bounce: 38, updatedAt: "2026-05-10" },
  { slug: "/philosophy", title: "Philosophy", status: "Published", views30d: 9120, avgTime: "02:14", bounce: 32, updatedAt: "2026-05-08" },
  { slug: "/products", title: "Products", status: "Published", views30d: 22840, avgTime: "03:08", bounce: 28, updatedAt: "2026-05-12" },
  { slug: "/lifestyle", title: "Lifestyle Protocols", status: "Published", views30d: 7610, avgTime: "02:48", bounce: 30, updatedAt: "2026-05-09" },
  { slug: "/rituals", title: "Daily Rituals", status: "Published", views30d: 11290, avgTime: "02:32", bounce: 29, updatedAt: "2026-05-14" },
  { slug: "/journal", title: "Journal — Field Notes", status: "Published", views30d: 5840, avgTime: "03:22", bounce: 41, updatedAt: "2026-05-06" },
  { slug: "/contact", title: "Contact — Apothecary", status: "Published", views30d: 3210, avgTime: "01:08", bounce: 52, updatedAt: "2026-05-04" },
  { slug: "/lookbook", title: "Lookbook — SS26", status: "Draft", views30d: 0, avgTime: "—", bounce: 0, updatedAt: "2026-05-13" },
];

// 14-day revenue trend
export const revenueSeries = [
  { d: "Apr 30", revenue: 84200, orders: 38 },
  { d: "May 01", revenue: 91400, orders: 41 },
  { d: "May 02", revenue: 76900, orders: 34 },
  { d: "May 03", revenue: 102300, orders: 47 },
  { d: "May 04", revenue: 118900, orders: 52 },
  { d: "May 05", revenue: 96400, orders: 44 },
  { d: "May 06", revenue: 108700, orders: 49 },
  { d: "May 07", revenue: 125200, orders: 56 },
  { d: "May 08", revenue: 134900, orders: 61 },
  { d: "May 09", revenue: 142100, orders: 64 },
  { d: "May 10", revenue: 121300, orders: 55 },
  { d: "May 11", revenue: 138700, orders: 62 },
  { d: "May 12", revenue: 154200, orders: 71 },
  { d: "May 13", revenue: 168900, orders: 78 },
];

export const trafficByChannel = [
  { channel: "Organic", visits: 24800, share: 38 },
  { channel: "Direct", visits: 14200, share: 22 },
  { channel: "Social", visits: 12900, share: 20 },
  { channel: "Email", visits: 8400, share: 13 },
  { channel: "Referral", visits: 4500, share: 7 },
];

export const cohortRetention = [
  { cohort: "Jan", m0: 100, m1: 62, m2: 48, m3: 41 },
  { cohort: "Feb", m0: 100, m1: 68, m2: 52, m3: 44 },
  { cohort: "Mar", m0: 100, m1: 71, m2: 56, m3: 47 },
  { cohort: "Apr", m0: 100, m1: 74, m2: 58, m3: 0 },
  { cohort: "May", m0: 100, m1: 0, m2: 0, m3: 0 },
];

export const formatINR = (n: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(n);
