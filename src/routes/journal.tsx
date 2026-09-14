import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Clock } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import journalHero from "@/assets/journal-hero.jpg";
import careImg from "@/assets/care-banner.jpg";
import ingredientsImg from "@/assets/ingredients-hero.jpg";
import productsHero from "@/assets/products-hero.jpg";

export const Route = createFileRoute("/journal")({
  head: () => ({
    meta: [
      { title: "Journal — Aranya" },
      {
        name: "description",
        content:
          "Quiet dispatches from the apothecary — essays on adaptogens, harvest notes, and the science of slow.",
      },
      { property: "og:title", content: "Aranya — The Journal" },
      { property: "og:description", content: "Letters from the forest, written by the people who tend it." },
    ],
  }),
  component: JournalPage,
});

const featured = {
  img: journalHero,
  cat: "Field Notes",
  title: "Why curcuminoids fail without fat — and how we solved it.",
  excerpt:
    "Three years of milling experiments, one accidental discovery during monsoon. The chemistry of bioavailability, told plainly.",
  read: "9 min read",
};

const posts = [
  { img: careImg, cat: "Sourcing", title: "The farmer who refuses to pick before sunrise.", read: "6 min" },
  { img: ingredientsImg, cat: "Science", title: "Withanolides: what the label leaves out.", read: "8 min" },
  { img: productsHero, cat: "Rituals", title: "On the half-spoon. A short defence of small doses.", read: "4 min" },
  { img: journalHero, cat: "House Letters", title: "The first hundred customers wrote back. Here is what they said.", read: "5 min" },
  { img: careImg, cat: "Field Notes", title: "Monsoon harvest, 2024. A diary in five entries.", read: "7 min" },
  { img: ingredientsImg, cat: "Science", title: "Why we triple-assay every batch (and what fails).", read: "6 min" },
];

function JournalPage() {
  return (
    <div className="relative bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      <PageHero
        eyebrow="Letters from the forest"
        title={
          <>
            Slow reading,{" "}
            <em className="not-italic italic text-terra">for the curious.</em>
          </>
        }
        subtitle="Essays, harvest diaries and laboratory notes — written in-house, published only when worth publishing."
        image={journalHero}
        imageAlt="Open botanical journal"
      />

      {/* FEATURED */}
      <section className="px-6 py-20 md:px-10 md:py-28">
        <div className="mx-auto max-w-7xl">
          <Reveal>
            <article className="group grid gap-10 overflow-hidden rounded-sm border border-cream/10 bg-walnut/20 md:grid-cols-2">
              <div className="relative aspect-[4/3] overflow-hidden md:aspect-auto">
                <img src={featured.img} alt={featured.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" loading="lazy" />
              </div>
              <div className="flex flex-col justify-center p-8 md:p-12">
                <span className="text-[11px] uppercase tracking-[0.28em] text-terra">{featured.cat} · Featured</span>
                <h2 className="mt-5 font-display text-3xl leading-tight md:text-5xl">{featured.title}</h2>
                <p className="mt-5 text-cream/70 leading-relaxed">{featured.excerpt}</p>
                <div className="mt-8 flex items-center gap-6 text-[11px] uppercase tracking-[0.22em] text-cream/55">
                  <span className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {featured.read}</span>
                  <a href="#" className="group/btn inline-flex items-center gap-2 text-cream hover:text-sand">
                    Read essay
                    <ArrowRight className="h-3.5 w-3.5 transition group-hover/btn:translate-x-1" />
                  </a>
                </div>
              </div>
            </article>
          </Reveal>
        </div>
      </section>

      {/* GRID */}
      <section className="px-6 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto max-w-7xl">
          <div className="mb-12 flex items-end justify-between gap-6">
            <Reveal>
              <span className="text-xs uppercase tracking-[0.32em] text-sand/70">All entries</span>
              <h2 className="mt-3 font-display text-4xl md:text-5xl">The archive.</h2>
            </Reveal>
          </div>

          <div className="grid gap-x-8 gap-y-14 md:grid-cols-2 lg:grid-cols-3">
            {posts.map((p, i) => (
              <Reveal key={i} delay={(i % 3) * 0.08}>
                <a href="#" className="group block">
                  <div className="aspect-[4/3] overflow-hidden rounded-sm bg-walnut/30">
                    <img src={p.img} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />
                  </div>
                  <span className="mt-5 block text-[11px] uppercase tracking-[0.28em] text-terra">{p.cat}</span>
                  <h3 className="mt-3 font-display text-2xl leading-snug transition group-hover:text-sand">{p.title}</h3>
                  <span className="mt-4 inline-flex items-center gap-2 text-[11px] uppercase tracking-[0.22em] text-cream/50">
                    <Clock className="h-3 w-3" /> {p.read}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* SUBSCRIBE */}
      <section className="border-t border-cream/8 bg-walnut/20 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-sand/80">The dispatch</span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">Sent only when something is worth sending.</h2>
          <form className="mx-auto mt-10 flex max-w-md gap-2 border-b border-cream/30 pb-2">
            <input type="email" placeholder="your@address" className="flex-1 bg-transparent py-2 text-sm placeholder:text-cream/40 focus:outline-none" />
            <button className="text-[12px] uppercase tracking-[0.25em] text-sand transition hover:text-cream">Subscribe →</button>
          </form>
          <Link to="/products" className="mt-10 inline-block text-[12px] uppercase tracking-[0.22em] text-cream/60 hover:text-cream">
            Or visit the apothecary →
          </Link>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
