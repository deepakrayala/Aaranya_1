import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import { AranyaMark } from "@/components/AranyaMark";
import philosophyHero from "@/assets/philosophy-hero.jpg";
import careImg from "@/assets/care-banner.jpg";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Philosophy — Aranya" },
      {
        name: "description",
        content:
          "Aranya means 'forest'. A four-generation reverence for soil, season and the slow craft of pure botanicals.",
      },
      { property: "og:title", content: "Aranya — Our Philosophy" },
      { property: "og:description", content: "Rooted in reverence. Grown for the few." },
    ],
  }),
  component: PhilosophyPage,
});

function PhilosophyPage() {
  return (
    <div className="relative bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      <PageHero
        eyebrow="A·R·A·N·Y·A · Sanskrit for forest"
        title={
          <>
            We did not invent this.{" "}
            <em className="not-italic italic text-terra">The forest did.</em>
          </>
        }
        subtitle="Four generations of growers. One unbroken vow: nothing added, nothing taken away."
        image={philosophyHero}
        imageAlt="Forest sanctuary at golden hour"
      />

      {/* TENETS */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-x-16 gap-y-20 md:grid-cols-3">
          {[
            { n: "I.", h: "Soil over scale.", b: "We refuse to grow faster than the land allows. Yields are smaller. Potency is not." },
            { n: "II.", h: "Whole, never extracted.", b: "We grind the plant — root, leaf, bloom. Synergy is the original science." },
            { n: "III.", h: "Proven, then sold.", b: "Every batch leaves only after triple-stage assay: identity, potency, purity." },
          ].map((t, i) => (
            <Reveal key={t.n} delay={i * 0.1}>
              <span className="font-display text-3xl text-terra">{t.n}</span>
              <h3 className="mt-4 font-display text-3xl">{t.h}</h3>
              <p className="mt-4 leading-relaxed text-cream/65">{t.b}</p>
            </Reveal>
          ))}
        </div>
      </section>

      {/* TIMELINE */}
      <section className="border-t border-cream/8 bg-walnut/20 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-5xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">A four-generation lineage</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">The slow line.</h2>
          </Reveal>
          <div className="mt-16 space-y-10 border-l border-cream/15 pl-8">
            {[
              { y: "1948", t: "First grove", b: "A great-grandfather plants tulsi at the edge of the Western Ghats." },
              { y: "1979", t: "Stone mill", b: "The family commissions a granite mill — slow turn, low heat, no compromise." },
              { y: "2007", t: "Certified organic", b: "USDA & India Organic certifications. Documented from seed." },
              { y: "2024", t: "Aranya", b: "We open the doors of the apothecary to a small, devoted few." },
            ].map((m, i) => (
              <Reveal key={m.y} delay={i * 0.06} className="relative">
                <span className="absolute -left-[42px] top-1 flex h-5 w-5 items-center justify-center rounded-full bg-sand">
                  <span className="h-2 w-2 rounded-full bg-umber" />
                </span>
                <div className="font-display text-2xl text-sand">{m.y}</div>
                <h4 className="mt-1 font-display text-2xl">{m.t}</h4>
                <p className="mt-2 max-w-xl text-cream/65">{m.b}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* QUOTE + IMG */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl gap-12 md:grid-cols-[1fr_1.2fr] md:items-center">
          <Reveal>
            <div className="aspect-[4/5] overflow-hidden rounded-sm">
              <img src={careImg} alt="Hand harvesting" className="h-full w-full object-cover" loading="lazy" />
            </div>
          </Reveal>
          <Reveal delay={0.1}>
            <AranyaMark size={48} className="text-sand/80" />
            <blockquote className="mt-6 font-display text-3xl leading-snug md:text-4xl">
              "If you cannot taste the soil, we have failed. <em className="italic text-terra not-italic">Purity is a flavour.</em>"
            </blockquote>
            <p className="mt-6 text-[12px] uppercase tracking-[0.25em] text-cream/55">— Mira N., Master Grower</p>
            <Link to="/products" className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand">
              Meet the apothecary
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
