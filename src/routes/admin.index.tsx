import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { ArrowDownRight, ArrowUpRight, Package, ShoppingBag, Users } from "lucide-react";
import { formatINRPaise, getAdminAnalytics, getAdminDashboard, paiseToNumber } from "@/lib/api/admin";
import { orderStatuses } from "@/lib/api/orders";

export const Route = createFileRoute("/admin/")({
  component: AdminDashboard,
});

const palette = ["#c9794a", "#d9a86a", "#8b6f5e", "#5e4a3c", "#2d2520"];

function Kpi({ label, value, note, icon: Icon, positive = true }: { label: string; value: string; note: string; icon: any; positive?: boolean }) {
  return (
    <div className="rounded-lg border border-cream/8 bg-[#161310] p-5">
      <div className="flex items-center justify-between">
        <span className="text-[10px] uppercase tracking-[0.28em] text-cream/45">{label}</span>
        <Icon className="h-4 w-4 text-terra/80" />
      </div>
      <div className="mt-4 font-display text-3xl">{value}</div>
      <div className={`mt-2 inline-flex items-center gap-1 text-xs ${positive ? "text-emerald-400/90" : "text-amber-300/90"}`}>
        {positive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
        <span className="text-cream/40">{note}</span>
      </div>
    </div>
  );
}

function AdminDashboard() {
  const dashboard = useQuery({ queryKey: ["admin", "dashboard"], queryFn: getAdminDashboard });
  const analytics = useQuery({ queryKey: ["admin", "analytics", 30], queryFn: () => getAdminAnalytics(30) });

  if (dashboard.isPending || analytics.isPending) return <div className="px-6 py-8 text-cream/55">Loading dashboard...</div>;
  if (dashboard.isError || analytics.isError) return <div className="px-6 py-8 text-rose-300">Unable to load dashboard metrics.</div>;

  const metrics = dashboard.data.metrics;
  const revenueSeries = analytics.data.revenue_series.map((point) => ({
    ...point,
    revenue: paiseToNumber(point.revenue_paise) / 100,
  }));
  const aovPaise = metrics.orders > 0 ? Math.round(paiseToNumber(metrics.revenue_paise) / metrics.orders) : 0;
  const fulfillmentData = [
    { label: "Pending", count: metrics.pending_orders },
    { label: "Delivered", count: metrics.delivered_orders },
    { label: "Other", count: Math.max(0, metrics.orders - metrics.pending_orders - metrics.delivered_orders) },
  ];

  return (
    <div className="space-y-8 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Good morning, Studio.</h1>
          <p className="mt-1 text-sm text-cream/55">PostgreSQL operations snapshot - IST</p>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <Kpi label="Revenue" value={formatINRPaise(metrics.revenue_paise)} note="paid through delivered" icon={ShoppingBag} />
        <Kpi label="Orders" value={metrics.orders.toLocaleString("en-IN")} note={`${metrics.pending_orders} pending`} icon={Package} />
        <Kpi label="Avg order value" value={formatINRPaise(aovPaise)} note="successful revenue / orders" icon={ArrowUpRight} />
        <Kpi label="Customers" value={metrics.customers.toLocaleString("en-IN")} note={`${metrics.products} products`} icon={Users} positive={metrics.low_stock_products === 0} />
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-cream/8 bg-[#161310] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">Revenue trend</div>
              <div className="mt-1 font-display text-xl">Daily flow</div>
            </div>
            <div className="flex gap-3 text-xs text-cream/60">
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-terra" />Revenue</span>
              <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-gold" />Orders</span>
            </div>
          </div>
          <div className="mt-4 h-[280px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={revenueSeries}>
                <defs>
                  <linearGradient id="rev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#c9794a" stopOpacity={0.6} />
                    <stop offset="100%" stopColor="#c9794a" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="d" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `INR ${Math.round(Number(v) / 1000)}k`} />
                <Tooltip
                  contentStyle={{ background: "#1c1815", border: "1px solid #ffffff15", borderRadius: 8, fontSize: 12 }}
                  labelStyle={{ color: "#fff8eb" }}
                  formatter={(v: number, name) => name === "revenue" ? formatINRPaise(Math.round(v * 100)) : v}
                />
                <Area type="monotone" dataKey="revenue" stroke="#c9794a" strokeWidth={2} fill="url(#rev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-cream/8 bg-[#161310] p-5">
          <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">Order health</div>
          <div className="mt-1 font-display text-xl">Fulfillment snapshot</div>
          <div className="mt-2 h-[220px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={fulfillmentData} dataKey="count" nameKey="label" innerRadius={50} outerRadius={80} stroke="none">
                  {fulfillmentData.map((_, i) => (
                    <Cell key={i} fill={palette[i % palette.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#1c1815", border: "1px solid #ffffff15", borderRadius: 8, fontSize: 12 }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <ul className="mt-2 space-y-1.5 text-xs">
            {fulfillmentData.map((item, i) => (
              <li key={item.label} className="flex items-center justify-between text-cream/65">
                <span className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: palette[i] }} />
                  {item.label}
                </span>
                <span>{item.count.toLocaleString("en-IN")}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-lg border border-cream/8 bg-[#161310] p-5 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">Best sellers - 30d</div>
              <div className="mt-1 font-display text-xl">Top moving SKUs</div>
            </div>
            <Link to="/admin/products" className="text-xs uppercase tracking-[0.2em] text-terra hover:text-terra/80">
              All products {"->"}
            </Link>
          </div>
          <div className="mt-4 h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={dashboard.data.top_products} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="name" stroke="#ffffff55" fontSize={11} width={170} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ background: "#1c1815", border: "1px solid #ffffff15", borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="quantity_sold" fill="#c9794a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="rounded-lg border border-cream/8 bg-[#161310] p-5">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">Live</div>
              <div className="mt-1 font-display text-xl">Recent orders</div>
            </div>
            <Link to="/admin/orders" className="text-xs uppercase tracking-[0.2em] text-terra hover:text-terra/80">
              All {"->"}
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {dashboard.data.recent_orders.map((o) => (
              <li key={o.id} className="flex items-center justify-between border-b border-cream/8 pb-3 text-sm last:border-0">
                <div>
                  <div className="text-cream">{o.customer_name}</div>
                  <div className="text-xs text-cream/45">Order #{o.order_number} - {o.shipping_city}</div>
                </div>
                <div className="text-right">
                  <div className="text-cream">{formatINRPaise(o.total_amount_paise)}</div>
                  <StatusPill status={orderStatuses[o.status as keyof typeof orderStatuses]} />
                </div>
              </li>
            ))}
            {dashboard.data.recent_orders.length === 0 && <li className="text-sm text-cream/45">No orders yet.</li>}
          </ul>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {[
          { title: `${metrics.low_stock_products} low-stock products`, body: "Threshold: 10 units or fewer.", tone: metrics.low_stock_products ? "amber" : "emerald" },
          { title: `${metrics.pending_orders} pending orders`, body: "Orders waiting for payment confirmation.", tone: metrics.pending_orders ? "amber" : "emerald" },
          { title: `${metrics.delivered_orders} delivered orders`, body: "Delivered status from PostgreSQL orders.", tone: "emerald" },
        ].map((a) => (
          <div key={a.title} className="rounded-lg border border-cream/8 bg-[#161310] p-5">
            <div className={`text-[10px] uppercase tracking-[0.28em] ${a.tone === "amber" ? "text-amber-300/90" : "text-emerald-300/90"}`}>
              Attention
            </div>
            <div className="mt-2 font-display text-lg">{a.title}</div>
            <p className="mt-1 text-sm text-cream/55">{a.body}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export function StatusPill({ status }: { status: string }) {
  const map: Record<string, string> = {
    Paid: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    "Pending payment": "bg-amber-500/15 text-amber-300 border-amber-500/20",
    Processing: "bg-amber-500/15 text-amber-300 border-amber-500/20",
    Shipped: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    Delivered: "bg-cream/10 text-cream/70 border-cream/15",
    Cancelled: "bg-rose-500/15 text-rose-300 border-rose-500/20",
    Refunded: "bg-rose-500/15 text-rose-300 border-rose-500/20",
    Live: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    Draft: "bg-cream/10 text-cream/60 border-cream/15",
    "Low stock": "bg-amber-500/15 text-amber-300 border-amber-500/20",
    "Out of stock": "bg-rose-500/15 text-rose-300 border-rose-500/20",
    Published: "bg-emerald-500/15 text-emerald-300 border-emerald-500/20",
    VIP: "bg-terra/20 text-terra border-terra/30",
    Returning: "bg-sky-500/15 text-sky-300 border-sky-500/20",
    New: "bg-cream/10 text-cream/70 border-cream/15",
  };
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-[0.18em] ${map[status] ?? "bg-cream/10 text-cream/70 border-cream/15"}`}>
      {status}
    </span>
  );
}
