import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { formatINRPaise, getAdminAnalytics, paiseToNumber } from "@/lib/api/admin";

export const Route = createFileRoute("/admin/analytics")({
  component: AnalyticsAdmin,
});

const palette = ["#c9794a", "#d9a86a", "#8b6f5e", "#5e4a3c", "#2d2520", "#a95c48", "#b68b59"];
const ranges = [7, 30, 90] as const;
const tooltip = { background: "#1c1815", border: "1px solid #ffffff15", borderRadius: 8, fontSize: 12 };

function AnalyticsAdmin() {
  const [range, setRange] = useState<(typeof ranges)[number]>(30);
  const analytics = useQuery({ queryKey: ["admin", "analytics", range], queryFn: () => getAdminAnalytics(range) });

  if (analytics.isPending) return <div className="px-6 py-8 text-cream/55">Loading analytics...</div>;
  if (analytics.isError) return <div className="px-6 py-8 text-rose-300">{analytics.error.message}</div>;

  const revenueSeries = analytics.data.revenue_series.map((point) => ({
    ...point,
    revenue: paiseToNumber(point.revenue_paise) / 100,
  }));
  const topProducts = analytics.data.top_products.map((product) => ({
    ...product,
    revenue: paiseToNumber(product.revenue_paise) / 100,
  }));
  const categoryPerformance = analytics.data.category_performance.map((category) => ({
    ...category,
    revenue: paiseToNumber(category.revenue_paise) / 100,
  }));

  return (
    <div className="space-y-8 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Analytics</h1>
          <p className="mt-1 text-sm text-cream/55">Revenue, order status, and product velocity from PostgreSQL.</p>
        </div>
        <div className="flex gap-1.5">
          {ranges.map((value) => (
            <button
              key={value}
              onClick={() => setRange(value)}
              className={`rounded-md border px-3 py-1.5 text-xs uppercase tracking-[0.2em] ${
                range === value ? "border-terra/50 bg-terra/15 text-cream" : "border-cream/10 text-cream/55 hover:bg-cream/[0.04]"
              }`}
            >
              {value}D
            </button>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card title="Revenue vs orders" sub={`${range} day window`}>
          {revenueSeries.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={revenueSeries}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="d" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis yAxisId="r" stroke="#ffffff55" fontSize={11} tickFormatter={(v) => `INR ${Math.round(Number(v) / 1000)}k`} tickLine={false} axisLine={false} />
                <YAxis yAxisId="o" orientation="right" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltip} formatter={(v: number, name) => name === "revenue" ? formatINRPaise(Math.round(v * 100)) : v} />
                <Line yAxisId="r" type="monotone" dataKey="revenue" stroke="#c9794a" strokeWidth={2} dot={false} />
                <Line yAxisId="o" type="monotone" dataKey="orders" stroke="#d9a86a" strokeWidth={2} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <Empty>No revenue data for this range.</Empty>
          )}
        </Card>

        <Card title="Orders by status" sub="All time">
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={analytics.data.status_distribution} dataKey="count" nameKey="label" innerRadius={60} outerRadius={100} stroke="none">
                {analytics.data.status_distribution.map((_, i) => (
                  <Cell key={i} fill={palette[i % palette.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltip} />
              <Legend wrapperStyle={{ fontSize: 11, color: "#fff8eb99" }} />
            </PieChart>
          </ResponsiveContainer>
        </Card>

        <Card title="Top products" sub={`${range} day window`}>
          {topProducts.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={topProducts}>
                <CartesianGrid stroke="#ffffff10" vertical={false} />
                <XAxis dataKey="name" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis stroke="#ffffff55" fontSize={11} tickFormatter={(v) => `INR ${Math.round(Number(v) / 1000)}k`} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltip} formatter={(v: number) => formatINRPaise(Math.round(v * 100))} />
                <Bar dataKey="revenue" fill="#c9794a" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty>No successful product sales for this range.</Empty>
          )}
        </Card>

        <Card title="Category performance" sub={`${range} day window`}>
          {categoryPerformance.length ? (
            <ResponsiveContainer width="100%" height={260}>
              <BarChart data={categoryPerformance} layout="vertical" margin={{ left: 20 }}>
                <CartesianGrid stroke="#ffffff10" horizontal={false} />
                <XAxis type="number" stroke="#ffffff55" fontSize={11} tickLine={false} axisLine={false} />
                <YAxis type="category" dataKey="category_name" stroke="#ffffff55" fontSize={11} width={150} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={tooltip} />
                <Bar dataKey="quantity_sold" fill="#c9794a" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <Empty>No category data yet.</Empty>
          )}
        </Card>
      </div>

      <Card title="Top product detail" sub="Uses order item purchase snapshots">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-cream/8 text-[10px] uppercase tracking-[0.22em] text-cream/45">
                <th className="px-4 py-3 text-left">Product</th>
                <th className="px-4 py-3 text-left">SKU</th>
                <th className="px-4 py-3 text-right">Quantity</th>
                <th className="px-4 py-3 text-right">Revenue</th>
              </tr>
            </thead>
            <tbody>
              {analytics.data.top_products.map((product) => (
                <tr key={`${product.product_id}-${product.sku}`} className="border-b border-cream/5 last:border-0">
                  <td className="px-4 py-3 text-cream">{product.name}</td>
                  <td className="px-4 py-3 font-mono text-xs text-cream/55">{product.sku}</td>
                  <td className="px-4 py-3 text-right">{product.quantity_sold.toLocaleString("en-IN")}</td>
                  <td className="px-4 py-3 text-right">{formatINRPaise(product.revenue_paise)}</td>
                </tr>
              ))}
              {analytics.data.top_products.length === 0 && <tr><td colSpan={4} className="px-4 py-12 text-center text-cream/45">No top products yet.</td></tr>}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="flex h-[260px] items-center justify-center text-sm text-cream/45">{children}</div>;
}

function Card({ title, sub, children }: { title: string; sub?: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border border-cream/8 bg-[#161310] p-5">
      <div className="text-[10px] uppercase tracking-[0.28em] text-cream/45">{sub}</div>
      <div className="mt-1 font-display text-xl">{title}</div>
      <div className="mt-4">{children}</div>
    </div>
  );
}
