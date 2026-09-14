import { createFileRoute, Link, Navigate, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { getOrders, orderStatuses } from "@/lib/api/orders";

export const Route = createFileRoute("/orders")({ component: OrdersPage });

const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function OrdersPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/orders" ? <OrdersList /> : <Outlet />;
}

function OrdersList() {
  const current = useCurrentUser();
  const orders = useQuery({ queryKey: ["orders"], queryFn: getOrders, enabled: !!current.data });

  if (current.isPending) return <div className="min-h-screen bg-umber" />;
  if (!current.data) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-umber text-cream">
      <SiteHeader />
      <main className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[.3em] text-sand">Order history</p>
          <h1 className="mt-4 font-display text-5xl">Your Aranya orders.</h1>

          {orders.isPending ? <p className="mt-10 text-cream/55">Loading orders...</p> : orders.isError ? <p className="mt-10 text-rose-300">{orders.error.message}</p> : !orders.data.orders.length ? (
            <div className="mt-10 rounded border border-cream/10 bg-walnut/30 p-8 text-cream/65">
              No orders yet.
              <Link to="/products" className="ml-2 text-sand hover:text-cream">Browse products</Link>
            </div>
          ) : (
            <div className="mt-10 space-y-4">
              {orders.data.orders.map((order) => (
                <Link key={order.id} to="/orders/$id" params={{ id: order.id }} className="block rounded border border-cream/10 bg-walnut/30 p-5 transition hover:border-sand/40">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <p className="font-mono text-sm text-cream/80">Order #{order.order_number}</p>
                      <p className="mt-2 text-sm text-cream/50">{new Date(order.created_at).toLocaleString()}</p>
                      <p className="mt-2 text-sm text-cream/60">{order.item_summary || `${order.item_count ?? 0} items`}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-display text-xl text-sand">{money(order.total_amount_paise)}</p>
                      <p className="mt-2 text-xs uppercase tracking-[.2em] text-cream/50">{orderStatuses[order.status]}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}
