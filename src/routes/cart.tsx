import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, Trash2 } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { SiteHeader } from "@/components/SiteHeader";
import { useCart, type CartItem } from "@/lib/cart";

export const Route = createFileRoute("/cart")({ component: CartPage });

const money = (paise: number) =>
  new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function CartPage() {
  const { items, subtotalPaise, updateQuantity, removeItem } = useCart();

  return (
    <div className="min-h-screen bg-umber text-cream">
      <SiteHeader />
      <main className="px-6 py-28 md:px-10">
        <div className="mx-auto max-w-5xl">
          <p className="text-xs uppercase tracking-[.3em] text-sand">Your cart</p>
          <h1 className="mt-4 font-display text-5xl">A ritual in progress.</h1>

          {items.length === 0 ? (
            <div className="mt-10 rounded border border-cream/10 bg-walnut/30 p-8 text-cream/65">
              Your cart is empty.
              <Link to="/products" className="ml-2 text-sand hover:text-cream">Browse products</Link>
            </div>
          ) : (
            <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_320px]">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartLine key={item.product_id} item={item} onUpdate={updateQuantity} onRemove={removeItem} />
                ))}
              </div>
              <aside className="h-fit rounded border border-cream/10 bg-walnut/30 p-6">
                <h2 className="font-display text-2xl">Order summary</h2>
                <div className="mt-5 flex justify-between border-t border-cream/10 pt-5">
                  <span className="text-cream/60">Subtotal</span>
                  <span className="font-display text-xl text-sand">{money(subtotalPaise)}</span>
                </div>
                <p className="mt-3 text-sm text-cream/50">Final price and stock are verified at checkout.</p>
                <Link to="/checkout" className="mt-6 flex w-full justify-center rounded-full bg-cream px-5 py-3 text-xs uppercase tracking-[.22em] text-umber transition hover:bg-sand">
                  Checkout
                </Link>
              </aside>
            </div>
          )}
        </div>
      </main>
      <SiteFooter />
    </div>
  );
}

function CartLine({ item, onUpdate, onRemove }: { item: CartItem; onUpdate: (id: string, quantity: number) => void; onRemove: (id: string) => void }) {
  return (
    <article className="grid gap-4 rounded border border-cream/10 bg-walnut/30 p-4 sm:grid-cols-[96px_1fr_auto]">
      <Link to="/products/$slug" params={{ slug: item.slug }} className="aspect-square overflow-hidden bg-umber">
        {item.image_url && <img src={item.image_url} alt={item.name} className="h-full w-full object-cover" />}
      </Link>
      <div>
        <Link to="/products/$slug" params={{ slug: item.slug }} className="font-display text-2xl hover:text-sand">{item.name}</Link>
        <p className="mt-2 text-sm text-cream/55">{money(item.price_paise)} each</p>
        <p className="mt-1 text-xs uppercase tracking-[.2em] text-cream/40">{item.stock_quantity} available</p>
      </div>
      <div className="flex items-center gap-4 sm:flex-col sm:items-end">
        <div className="flex items-center rounded-full border border-cream/15">
          <button onClick={() => onUpdate(item.product_id, item.quantity - 1)} disabled={item.quantity <= 1} className="p-2 text-cream/70 disabled:opacity-35" aria-label="Decrease quantity"><Minus className="h-4 w-4" /></button>
          <span className="min-w-9 text-center text-sm">{item.quantity}</span>
          <button onClick={() => onUpdate(item.product_id, item.quantity + 1)} disabled={item.quantity >= item.stock_quantity} className="p-2 text-cream/70 disabled:opacity-35" aria-label="Increase quantity"><Plus className="h-4 w-4" /></button>
        </div>
        <div className="text-right">
          <p className="font-display text-xl text-sand">{money(item.price_paise * item.quantity)}</p>
          <button onClick={() => onRemove(item.product_id)} className="mt-2 inline-flex items-center gap-1 text-xs uppercase tracking-[.18em] text-cream/45 hover:text-rose-300">
            <Trash2 className="h-3.5 w-3.5" /> Remove
          </button>
        </div>
      </div>
    </article>
  );
}
