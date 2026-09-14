import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search } from "lucide-react";
import { getAdminOrders, orderStatuses, type OrderStatus } from "@/lib/api/orders";

export const Route = createFileRoute("/admin/orders")({ component: OrdersAdmin });

const statusFilters: (OrderStatus | "All")[] = ["All", 1, 2, 3, 4, 5, 6, 7];
const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function OrdersAdmin() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/admin/orders" ? <OrdersList /> : <Outlet />;
}

function OrdersList() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<(typeof statusFilters)[number]>("All");
  const orders = useQuery({ queryKey: ["admin", "orders"], queryFn: getAdminOrders });

  const filtered = useMemo(() => {
    const list = orders.data?.orders ?? [];
    return list.filter((order) => {
      const matchesStatus = status === "All" || order.status === status;
      const haystack = `order #${order.order_number} ${order.order_number} ${order.id} ${order.customer_name} ${order.customer_email}`.toLowerCase();
      return matchesStatus && haystack.includes(q.toLowerCase());
    });
  }, [orders.data?.orders, q, status]);
  const totalRevenue = filtered.reduce((sum, order) => sum + (order.status === 7 ? 0 : order.total_amount_paise), 0);

  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl">Orders</h1>
          <p className="mt-1 text-sm text-cream/55">
            {filtered.length} matching - {money(totalRevenue)} net
          </p>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="flex flex-1 items-center gap-2 rounded-md border border-cream/10 bg-[#161310] px-3 py-2 text-sm">
          <Search className="h-4 w-4 text-cream/40" />
          <input value={q} onChange={(event) => setQ(event.target.value)} placeholder="Search order number or customer..." className="flex-1 bg-transparent text-cream outline-none placeholder:text-cream/40" />
        </div>
        <div className="flex gap-1.5 overflow-x-auto">
          {statusFilters.map((filter) => (
            <button key={filter} onClick={() => setStatus(filter)} className={`whitespace-nowrap rounded-md border px-3 py-1.5 text-xs uppercase tracking-[0.2em] ${status === filter ? "border-terra/50 bg-terra/15 text-cream" : "border-cream/10 text-cream/55 hover:bg-cream/[0.04]"}`}>
              {filter === "All" ? "All" : orderStatuses[filter]}
            </button>
          ))}
        </div>
      </div>

      {orders.isPending ? <p className="py-12 text-cream/55">Loading orders...</p> : orders.isError ? <p className="py-12 text-rose-300">{orders.error.message}</p> : (
        <div className="overflow-hidden rounded-lg border border-cream/8 bg-[#161310]">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-cream/8 text-[10px] uppercase tracking-[0.22em] text-cream/45">
                  <th className="px-4 py-3 text-left">Order</th>
                  <th className="px-4 py-3 text-left">Customer</th>
                  <th className="px-4 py-3 text-left">City</th>
                  <th className="px-4 py-3 text-right">Items</th>
                  <th className="px-4 py-3 text-right">Total</th>
                  <th className="px-4 py-3 text-left">Status</th>
                  <th className="px-4 py-3 text-left">Date</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((order) => (
                  <tr key={order.id} className="border-b border-cream/5 last:border-0 hover:bg-cream/[0.02]">
                    <td className="px-4 py-3 font-mono text-cream/85">Order #{order.order_number}</td>
                    <td className="px-4 py-3">
                      <div className="text-cream">{order.customer_name}</div>
                      <div className="text-xs text-cream/45">{order.customer_email}</div>
                    </td>
                    <td className="px-4 py-3 text-cream/65">{order.shipping_city}</td>
                    <td className="px-4 py-3 text-right">{order.item_count ?? 0}</td>
                    <td className="px-4 py-3 text-right">{money(order.total_amount_paise)}</td>
                    <td className="px-4 py-3 text-cream/65">{orderStatuses[order.status]}</td>
                    <td className="px-4 py-3 text-cream/55">{new Date(order.created_at).toLocaleDateString()}</td>
                    <td className="px-4 py-3 text-right">
                      <Link to="/admin/orders/$id" params={{ id: order.id }} className="text-[10px] uppercase tracking-[0.2em] text-terra hover:text-sand">Open</Link>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && <tr><td colSpan={8} className="px-4 py-12 text-center text-cream/45">No orders match these filters.</td></tr>}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
