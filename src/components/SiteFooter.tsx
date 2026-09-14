import { AranyaMark } from "./AranyaMark";

export function SiteFooter() {
  return (
    <footer className="border-t border-cream/10 bg-umber">
      <div className="mx-auto grid max-w-7xl gap-12 px-6 py-20 md:grid-cols-[1.2fr_1fr_1fr_1fr] md:px-10">
        <div>
          <div className="flex items-center gap-3 text-cream">
            <AranyaMark size={42} className="text-sand" />
            <span className="font-display text-2xl tracking-[0.18em] uppercase">
              aranya
            </span>
          </div>
          <p className="mt-6 max-w-xs text-sm leading-relaxed text-cream/60">
            Sacred botanicals, certified pure. Cultivated, dried and packed with reverence
            in the foothills of the Western Ghats.
          </p>
        </div>
        {[
          { h: "Catalog", items: ["Powders", "Premixes", "Tonics", "Gummies", "Snacks"] },
          { h: "House", items: ["Our Story", "Sourcing", "Certifications", "Journal"] },
          { h: "Care", items: ["Contact", "Shipping", "Returns", "Subscriptions"] },
        ].map((c) => (
          <div key={c.h}>
            <h4 className="text-xs uppercase tracking-[0.25em] text-sand/80">{c.h}</h4>
            <ul className="mt-5 space-y-3 text-sm text-cream/70">
              {c.items.map((i) => (
                <li key={i}>
                  <a href="#" className="transition hover:text-cream">
                    {i}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-cream/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-6 py-6 text-xs uppercase tracking-[0.2em] text-cream/40 md:flex-row md:px-10">
          <span>© {new Date().getFullYear()} Aranya Botanicals</span>
          <span className="flex items-center gap-4">
            <span>USDA Organic · India Organic · Non-GMO</span>
            <a href="/admin" className="text-cream/30 transition hover:text-terra">Admin</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
