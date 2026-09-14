import { createFileRoute, Link, Outlet, useRouterState } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Filter } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { getCategories, getProducts } from "@/lib/api/catalog";
import productsHero from "@/assets/products-hero.jpg";

export const Route = createFileRoute("/products")({ component: ProductsPage });
const money = (paise: number) => new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(paise / 100);

function ProductsPage() {
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  return pathname === "/products" ? <ProductsCatalog /> : <Outlet />;
}

function ProductsCatalog() {
  const [category, setCategory] = useState<string>();
  const categories = useQuery({ queryKey: ["categories"], queryFn: getCategories });
  const products = useQuery({ queryKey: ["products", category], queryFn: () => getProducts(category) });

  const message = products.isPending || categories.isPending ? "Gathering the apothecary…" : products.isError || categories.isError ? "The catalog is unavailable. Please try again shortly." : !products.data?.products.length ? "No products are available in this ritual yet." : null;
  return <div className="relative bg-umber text-cream"><PageHero eyebrow="Founders' Edition · Save up to 30%" title={<>The whole apothecary, <em className="not-italic italic text-terra">in 84 forms.</em></>} subtitle="Single-origin botanicals, lab-tested and hand-packed." image={productsHero} imageAlt="Aranya botanical product flat-lay" />
    <section className="px-6 py-20 md:px-10 md:py-28"><div className="mx-auto max-w-7xl"><div className="mb-10 flex items-end justify-between"><div><span className="text-xs uppercase tracking-[0.32em] text-sand/70">The catalog</span><h2 className="mt-3 font-display text-4xl md:text-5xl">Browse by ritual.</h2></div><span className="inline-flex items-center gap-2 rounded-full border border-cream/20 px-4 py-2 text-[11px] uppercase tracking-[0.22em] text-cream/70"><Filter className="h-3.5 w-3.5" /> Refine</span></div>
      <div className="mb-12 flex flex-wrap gap-2"><button onClick={() => setCategory(undefined)} className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] ${!category ? "border-sand bg-sand text-umber" : "border-cream/15 text-cream/70"}`}>All</button>{categories.data?.categories.map((item) => <button key={item.id} onClick={() => setCategory(item.slug)} className={`rounded-full border px-4 py-2 text-[11px] uppercase tracking-[0.22em] ${category === item.slug ? "border-sand bg-sand text-umber" : "border-cream/15 text-cream/70"}`}>{item.name}</button>)}</div>
      {message ? <p className="py-16 text-center text-cream/60">{message}</p> : <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{products.data?.products.map((p, i) => <Link key={p.id} to="/products/$slug" params={{ slug: p.slug }} className="block"><motion.article initial={{ opacity: 0, y: 28 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: .6, delay: (i % 4) * .08 }} className="group overflow-hidden rounded-sm border border-cream/8 bg-walnut/30"><div className="relative aspect-[4/5] overflow-hidden bg-umber">{p.image_url ? <img src={p.image_url} alt={p.name} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" /> : <div className="h-full w-full bg-walnut/40" />}<span className="absolute right-4 top-4 rounded-full border border-cream/20 bg-umber/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cream/80">{p.category_name}</span></div><div className="flex items-start justify-between gap-4 p-5"><div><h3 className="font-display text-xl leading-tight">{p.name}</h3><p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-cream/50">{p.status === 3 ? "Out of stock" : "Add to ritual"}</p></div><div className="text-right"><span className="block font-display text-lg text-sand">{money(p.price_paise)}</span>{p.original_price_paise !== null && <span className="text-[11px] text-cream/40 line-through">{money(p.original_price_paise)}</span>}</div></div></motion.article></Link>)}</div>}</div></section>
    <section className="px-6 py-24 md:px-10 md:py-32"><div className="mx-auto flex max-w-5xl flex-col items-center text-center"><h2 className="font-display text-4xl md:text-5xl">The first 500 orders ship with a hand-numbered card.</h2><Link to="/" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-umber">Claim founders' pricing <ArrowRight className="h-4 w-4" /></Link></div></section><SiteFooter /></div>;
}
