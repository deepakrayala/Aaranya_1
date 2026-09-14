import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getAdminOrder, orderStatuses, updateAdminOrderStatus, type AdminOrder, type OrderStatus } from "@/lib/api/orders";

export const Route = createFileRoute("/admin/orders/$id")({ component: AdminOrderDetail });

const statusOptions = [1, 2, 3, 4, 5, 6, 7] as const;
const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function AdminOrderDetail() {
  const { id } = Route.useParams();
  const queryClient = useQueryClient();
  const orderQuery = useQuery({ queryKey: ["admin", "orders", id], queryFn: () => getAdminOrder(id) });
  const statusMutation = useMutation({
    mutationFn: (status: OrderStatus) => updateAdminOrderStatus(id, status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders", id] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["orders", id] });
    },
  });

  return (
    <div className="space-y-6 px-6 py-8 md:px-10">
      <Link to="/admin/orders" className="text-xs uppercase tracking-[0.22em] text-terra hover:text-sand">Back to orders</Link>
      {orderQuery.isPending ? <p className="py-12 text-cream/55">Loading order...</p> : orderQuery.isError ? <p className="py-12 text-rose-300">{orderQuery.error.message}</p> : (
        <>
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h1 className="font-display text-3xl">Order #{orderQuery.data.order.order_number}</h1>
              <p className="mt-2 text-sm text-cream/55">{new Date(orderQuery.data.order.created_at).toLocaleString()}</p>
              <p className="mt-1 text-sm text-cream/55">{orderQuery.data.order.customer_name} - {orderQuery.data.order.customer_email}</p>
            </div>
            <div className="rounded-lg border border-cream/8 bg-[#161310] p-4 text-right">
              <p className="font-display text-2xl text-sand">{money(orderQuery.data.order.total_amount_paise)}</p>
              <label className="mt-3 block text-left text-xs uppercase tracking-[0.2em] text-cream/45">
                Status
                <select disabled={statusMutation.isPending} value={orderQuery.data.order.status} onChange={(event) => statusMutation.mutate(Number(event.target.value) as OrderStatus)} className="mt-2 w-full rounded border border-cream/10 bg-[#0e0c0a] p-2 text-sm text-cream">
                  {statusOptions.map((status) => <option key={status} value={status}>{orderStatuses[status]}</option>)}
                </select>
              </label>
              {statusMutation.isError && <p className="mt-2 text-sm text-rose-300">{statusMutation.error.message}</p>}
              {orderQuery.data.order.status === 1 && (
                <button
                  disabled={statusMutation.isPending}
                  onClick={() => statusMutation.mutate(2)}
                  className="mt-3 w-full rounded-md bg-terra px-3 py-2 text-xs uppercase tracking-[0.18em] text-umber transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50"
                >
                  {statusMutation.isPending ? "Updating..." : "Mark Payment Completed"}
                </button>
              )}
            </div>
          </div>

          <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
            <section className="overflow-hidden rounded-lg border border-cream/8 bg-[#161310]">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-cream/8 text-[10px] uppercase tracking-[0.22em] text-cream/45">
                    <th className="px-4 py-3 text-left">Item</th>
                    <th className="px-4 py-3 text-left">SKU</th>
                    <th className="px-4 py-3 text-right">Qty</th>
                    <th className="px-4 py-3 text-right">Price</th>
                    <th className="px-4 py-3 text-right">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderQuery.data.items.map((item) => (
                    <tr key={item.id} className="border-b border-cream/5 last:border-0">
                      <td className="px-4 py-3">{item.product_name}</td>
                      <td className="px-4 py-3 text-cream/55">{item.sku}</td>
                      <td className="px-4 py-3 text-right">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{money(item.price_paise)}</td>
                      <td className="px-4 py-3 text-right">{money(item.price_paise * item.quantity)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </section>
            <aside className="space-y-4">
              <AddressSnapshot title="Shipping" order={orderQuery.data.order} prefix="shipping" />
              <AddressSnapshot title="Billing" order={orderQuery.data.order} prefix="billing" />
            </aside>
          </div>
        </>
      )}
    </div>
  );
}

function AddressSnapshot({ title, order, prefix }: { title: string; order: AdminOrder; prefix: "shipping" | "billing" }) {
  return (
    <div className="rounded-lg border border-cream/8 bg-[#161310] p-5">
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
