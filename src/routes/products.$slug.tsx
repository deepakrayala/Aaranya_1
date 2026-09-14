import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { CatalogApiError, getProduct } from "@/lib/api/catalog";
import { useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$slug")({ component: ProductDetail });

function ProductDetail() {
  const { slug } = Route.useParams();
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addProduct } = useCart();
  const query = useQuery({
    queryKey: ["product", slug],
    queryFn: () => getProduct(slug),
    select: (data) => data.product,
    retry: (failureCount, error) => !(error instanceof CatalogApiError && error.status === 404) && failureCount < 3,
  });

  if (query.isPending) return <div className="min-h-screen bg-umber px-6 py-32 text-cream">Gathering this ritual...</div>;
  if (query.isError) {
    const message = query.error instanceof CatalogApiError && query.error.status === 404
      ? "Product not found."
      : "This product could not be loaded right now.";
    return <div className="min-h-screen bg-umber px-6 py-32 text-cream">{message} <Link to="/products" className="text-sand">Return to products</Link></div>;
  }

  const product = query.data;
  const money = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);
  const unavailable = product.status === 3 || product.stock_quantity === 0;
  const safeQuantity = product.stock_quantity > 0 ? Math.min(quantity, product.stock_quantity) : 0;

  return (
    <div className="min-h-screen bg-umber px-6 py-28 text-cream md:px-10">
      <div className="mx-auto grid max-w-5xl gap-10 md:grid-cols-2">
        <div className="aspect-square overflow-hidden bg-walnut/40">
          {product.image_url && <img src={product.image_url} alt={product.name} className="h-full w-full object-cover" />}
        </div>
        <div>
          <p className="text-xs uppercase tracking-[.3em] text-sand">{product.category_name}</p>
          <h1 className="mt-4 font-display text-5xl">{product.name}</h1>
          <p className="mt-6 text-cream/65">{product.description}</p>
          <p className="mt-6 font-display text-2xl text-sand">{money(product.price_paise)}</p>
          {product.original_price_paise !== null && <p className="mt-1 text-cream/40 line-through">{money(product.original_price_paise)}</p>}
          <p className="mt-6 text-sm text-cream/60">
            {unavailable ? "Currently out of stock" : `${product.stock_quantity} available`}
            {product.rating !== null && ` - ${product.rating} rating`}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <div className="flex items-center rounded-full border border-cream/15">
              <button disabled={unavailable || safeQuantity <= 1} onClick={() => setQuantity((value) => Math.max(1, value - 1))} className="px-4 py-2 text-lg text-cream/70 disabled:opacity-35">-</button>
              <span className="min-w-10 text-center text-sm">{safeQuantity}</span>
              <button disabled={unavailable || safeQuantity >= product.stock_quantity} onClick={() => setQuantity((value) => Math.min(product.stock_quantity, value + 1))} className="px-4 py-2 text-lg text-cream/70 disabled:opacity-35">+</button>
            </div>
            <button disabled={unavailable || safeQuantity < 1} onClick={() => { addProduct(product, safeQuantity); setAdded(true); }} className="rounded-full bg-cream px-6 py-3 text-xs uppercase tracking-[.22em] text-umber transition hover:bg-sand disabled:cursor-not-allowed disabled:opacity-50">
              {unavailable ? "Out of stock" : "Add to cart"}
            </button>
            <Link to="/cart" className="text-xs uppercase tracking-[.22em] text-sand hover:text-cream">View cart</Link>
          </div>
          {added && <p className="mt-4 text-sm text-sand">Added to your cart.</p>}
        </div>
      </div>
    </div>
  );
}
