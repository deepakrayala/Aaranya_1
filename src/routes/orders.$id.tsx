import { createFileRoute, Link, Navigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { getOrder, orderStatuses, type Order } from "@/lib/api/orders";

export const Route = createFileRoute("/orders/$id")({ component: OrderDetailPage });

const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function OrderDetailPage() {
  const { id } = Route.useParams();
  const current = useCurrentUser();
  const orderQuery = useQuery({ queryKey: ["orders", id], queryFn: () => getOrder(id), enabled: !!current.data });

  if (current.isPending) return <div className="min-h-screen bg-umber" />;
  if (!current.data) return <Navigate to="/login" />;

  return (
    <div className="min-h-screen bg-umber text-cream">
      <SiteHeader />
      <main className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-5xl">
          <Link to="/orders" className="text-xs uppercase tracking-[.24em] text-sand hover:text-cream">Back to orders</Link>
          {orderQuery.isPending ? <p className="mt-10 text-cream/55">Loading order...</p> : orderQuery.isError ? <p className="mt-10 text-rose-300">{orderQuery.error.message}</p> : (
            <>
              <div className="mt-8 flex flex-wrap items-start justify-between gap-4">
                <div>
                  <p className="text-xs uppercase tracking-[.3em] text-sand">Order</p>
                  <h1 className="mt-4 font-display text-4xl">Order #{orderQuery.data.order.order_number}</h1>
                  <p className="mt-3 text-cream/55">{new Date(orderQuery.data.order.created_at).toLocaleString()}</p>
                </div>
                <div className="text-right">
                  <p className="font-display text-2xl text-sand">{money(orderQuery.data.order.total_amount_paise)}</p>
                  <p className="mt-2 text-xs uppercase tracking-[.2em] text-cream/50">{orderStatuses[orderQuery.data.order.status]}</p>
                </div>
              </div>

              <div className="mt-10 grid gap-6 lg:grid-cols-[1fr_320px]">
                <section className="rounded border border-cream/10 bg-walnut/30 p-6">
                  <h2 className="font-display text-2xl">Items</h2>
                  <div className="mt-4 space-y-4">
                    {orderQuery.data.items.map((item) => (
                      <div key={item.id} className="flex justify-between gap-4 border-b border-cream/8 pb-4 last:border-0">
                        <div>
                          <p>{item.product_name}</p>
                          <p className="mt-1 text-sm text-cream/45">SKU {item.sku} - Qty {item.quantity}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-sand">{money(item.price_paise * item.quantity)}</p>
                          <p className="mt-1 text-xs text-cream/40">{money(item.price_paise)} each</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
                <aside className="space-y-4">
                  <AddressSnapshot title="Shipping" order={orderQuery.data.order} prefix="shipping" />
                  <AddressSnapshot title="Billing" order={orderQuery.data.order} prefix="billing" />
                </aside>
              </div>
            </>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AddressSnapshot({ title, order, prefix }: { title: string; order: Order; prefix: "shipping" | "billing" }) {
  return (
    <div className="rounded border border-cream/10 bg-walnut/30 p-5">
      <h2 className="font-display text-xl">{title}</h2>
      <p className="mt-3 text-sm leading-6 text-cream/55">
        {order[`${prefix}_name`]}<br />
        {order[`${prefix}_address_line1`]}{order[`${prefix}_address_line2`] ? `, ${order[`${prefix}_address_line2`]}` : ""}<br />
        {order[`${prefix}_city`]}, {order[`${prefix}_state`]} {order[`${prefix}_postal_code`]}<br />
        {order[`${prefix}_country`]} - {order[`${prefix}_phone`]}
      </p>
    </div>
  );
}
