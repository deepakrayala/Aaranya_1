import { createFileRoute, Link, Navigate, useNavigate } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCurrentUser } from "@/hooks/use-auth";
import { createOrder } from "@/lib/api/orders";
import { getAddresses, type Address } from "@/lib/api/user";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function CheckoutPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const current = useCurrentUser();
  const { items, subtotalPaise, clearCart } = useCart();
  const addresses = useQuery({ queryKey: ["addresses"], queryFn: getAddresses, enabled: !!current.data });
  const [shippingId, setShippingId] = useState("");
  const [billingId, setBillingId] = useState("");

  const addressList = useMemo(() => addresses.data?.addresses ?? [], [addresses.data?.addresses]);

  useEffect(() => {
    if (!shippingId && addressList[0]) setShippingId(addressList[0].id);
    if (!billingId && addressList[0]) setBillingId(addressList[0].id);
  }, [addressList, billingId, shippingId]);

  const orderMutation = useMutation({
    mutationFn: () =>
      createOrder({
        items: items.map((item) => ({ product_id: item.product_id, quantity: item.quantity })),
        shipping_address_id: shippingId,
        billing_address_id: billingId || shippingId,
      }),
    onSuccess: ({ order }) => {
      clearCart();
      queryClient.invalidateQueries({ queryKey: ["orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "dashboard"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "analytics"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "orders"] });
      queryClient.invalidateQueries({ queryKey: ["admin", "customers"] });
      navigate({ to: "/orders/$id", params: { id: order.id } });
    },
  });

  if (current.isPending) return <div className="min-h-screen bg-umber" />;
  if (!current.data) return <Navigate to="/login" />;

  const canPlaceOrder = items.length > 0 && !!shippingId && !!(billingId || shippingId) && !orderMutation.isPending;

  return (
    <div className="min-h-screen bg-umber text-cream">
      <SiteHeader />
      <main className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[.3em] text-sand">Checkout</p>
          <h1 className="mt-4 font-display text-5xl">Confirm your order.</h1>

          {items.length === 0 ? (
            <div className="mt-10 rounded border border-cream/10 bg-walnut/30 p-8 text-cream/65">
              Your cart is empty.
              <Link to="/products" className="ml-2 text-sand hover:text-cream">Browse products</Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <section className="space-y-6">
                <div className="rounded border border-cream/10 bg-walnut/30 p-6">
                  <h2 className="font-display text-2xl">Addresses</h2>
                  {addresses.isPending ? <p className="mt-4 text-cream/55">Loading addresses...</p> : addresses.isError ? <p className="mt-4 text-rose-300">{addresses.error.message}</p> : addressList.length === 0 ? <p className="mt-4 text-cream/55">No saved addresses yet. <Link to="/account" className="text-sand">Add one in your account</Link>.</p> : (
                    <div className="mt-4 grid gap-4 md:grid-cols-2">
                      <AddressSelect title="Shipping address" addresses={addressList} value={shippingId} onChange={setShippingId} />
                      <AddressSelect title="Billing address" addresses={addressList} value={billingId || shippingId} onChange={setBillingId} />
                    </div>
                  )}
                </div>
                <div className="rounded border border-cream/10 bg-walnut/30 p-6">
                  <h2 className="font-display text-2xl">Items</h2>
                  <div className="mt-4 space-y-3">
                    {items.map((item) => (
                      <div key={item.product_id} className="flex justify-between gap-4 border-b border-cream/8 pb-3 last:border-0">
                        <div>
                          <p>{item.name}</p>
                          <p className="text-sm text-cream/50">Qty {item.quantity}</p>
                        </div>
                        <p className="text-sand">{money(item.price_paise * item.quantity)}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
              <aside className="h-fit rounded border border-cream/10 bg-walnut/30 p-6">
                <h2 className="font-display text-2xl">Summary</h2>
                <div className="mt-5 flex justify-between border-t border-cream/10 pt-5">
                  <span className="text-cream/60">Total</span>
                  <span className="font-display text-xl text-sand">{money(subtotalPaise)}</span>
                </div>
                <p className="mt-3 text-sm text-cream/50">Backend will recalculate total and verify stock before creating the order.</p>
                {orderMutation.isError && <p className="mt-4 text-sm text-rose-300">{orderMutation.error.message}</p>}
                <button disabled={!canPlaceOrder} onClick={() => orderMutation.mutate()} className="mt-6 w-full rounded-full bg-cream px-5 py-3 text-xs uppercase tracking-[.22em] text-umber transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50">
                  {orderMutation.isPending ? "Placing..." : "Place order"}
                </button>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function AddressSelect({ title, addresses, value, onChange }: { title: string; addresses: Address[]; value: string; onChange: (id: string) => void }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[.22em] text-cream/50">{title}</span>
      <select value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded border border-cream/10 bg-umber p-3 text-sm text-cream">
        {addresses.map((address) => (
          <option key={address.id} value={address.id}>{address.label} - {address.city}</option>
        ))}
      </select>
      {addresses.find((address) => address.id === value) && <AddressPreview address={addresses.find((address) => address.id === value)!} />}
    </label>
  );
}

function AddressPreview({ address }: { address: Address }) {
  return (
    <p className="mt-3 text-sm leading-6 text-cream/55">
      {address.address_line1}{address.address_line2 ? `, ${address.address_line2}` : ""}<br />
      {address.city}, {address.state} {address.postal_code}<br />
      {address.country} - {address.phone}
    </p>
  );
}
