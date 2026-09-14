import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Flame, Dumbbell, Moon, Sparkles, Clock, Droplet, Leaf, ShieldCheck } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import lifestyleHero from "@/assets/lifestyle-hero.jpg";
import energyImg from "@/assets/lifestyle-energy.jpg";
import strengthImg from "@/assets/lifestyle-strength.jpg";
import calmImg from "@/assets/lifestyle-calm.jpg";
import glowImg from "@/assets/lifestyle-glow.jpg";

export const Route = createFileRoute("/lifestyle")({
  head: () => ({
    meta: [
      { title: "Lifestyle — Aranya Protocols" },
      {
        name: "description",
        content:
          "Botanical stacks engineered for energy, strength, calm and glow. Curated combinations, optimal timing and absorption science from the Aranya apothecary.",
      },
      { property: "og:title", content: "Aranya Lifestyle — Botanical Protocols" },
      {
        property: "og:description",
        content: "Stacks, timing and absorption science for the body you intend to build.",
      },
    ],
  }),
  component: LifestylePage,
});

const protocols = [
  {
    icon: Flame,
    tag: "Energy & Metabolism",
    name: "The Ignite Stack",
    image: energyImg,
    intent: "Sustained morning fire without caffeine spikes.",
    stack: [
      { name: "Golden Turmeric Powder", dose: "½ tsp", time: "06:30 — empty stomach" },
      { name: "Triphala Morning Premix", dose: "1 sachet", time: "06:45 — warm water" },
      { name: "Moringa Greens", dose: "1 tsp", time: "11:00 — with breakfast" },
    ],
    absorbedWith: "Black pepper + a drop of ghee — boosts curcumin uptake by 20×.",
    accent: "from-terra/50 via-terra/10 to-transparent",
  },
  {
    icon: Dumbbell,
    tag: "Strength & Recovery",
    name: "The Forge Protocol",
    image: strengthImg,
    intent: "Build lean tissue, recover the nervous system after load.",
    stack: [
      { name: "Ashwagandha Vitality Oil", dose: "3 drops", time: "Pre-workout · 16:00" },
      { name: "Shatavari Bliss Tablets", dose: "1 tablet", time: "Post-workout · 18:00" },
      { name: "Forest Honey Paste", dose: "1 tsp", time: "Recovery window · 19:00" },
    ],
    absorbedWith: "Take with warm milk or oat milk — fat-soluble withanolides need lipids.",
    accent: "from-gold/40 via-gold/10 to-transparent",
  },
  {
    icon: Moon,
    tag: "Calm & Sleep",
    name: "The Stillness Cycle",
    image: calmImg,
    intent: "Quiet the cognitive loop, deepen REM and parasympathetic tone.",
    stack: [
      { name: "Tulsi Amber Tonic", dose: "20 ml", time: "20:00 — after dinner" },
      { name: "Brahmi Focus Gummies", dose: "1 gummy", time: "21:30 — wind-down" },
      { name: "Ashwagandha Vitality Oil", dose: "2 drops", time: "22:00 — under tongue" },
    ],
    absorbedWith: "Sublingual absorption bypasses digestion — onset within 8 minutes.",
    accent: "from-walnut/60 via-walnut/20 to-transparent",
  },
  {
    icon: Sparkles,
    tag: "Skin, Hair & Glow",
    name: "The Luminous Ritual",
    image: glowImg,
    intent: "Collagen support, sebum balance and antioxidant defense from within.",
    stack: [
      { name: "Moringa Greens Powder", dose: "1 tsp", time: "08:00 — smoothie" },
      { name: "Forest Honey Paste", dose: "½ tsp", time: "10:00 — straight" },
      { name: "Triphala Morning Premix", dose: "1 sachet", time: "22:00 — warm water" },
    ],
    absorbedWith: "Vitamin C from citrus or amla doubles iron and polyphenol uptake.",
    accent: "from-clay/45 via-clay/10 to-transparent",
  },
];

const absorptionPrinciples = [
  { icon: Droplet, h: "Lipid carriers", b: "Fat-soluble actives — withanolides, curcuminoids — need ghee, milk or oil to cross the gut wall." },
  { icon: Clock, h: "Circadian timing", b: "Adaptogens at dawn modulate cortisol; nervines after dusk amplify melatonin. Hour matters more than dose." },
  { icon: Leaf, h: "Whole-plant synergy", b: "Aranya never isolates molecules. Native co-factors are the absorption key the body already knows." },
  { icon: ShieldCheck, h: "Lab-verified potency", b: "Every batch standardised — 5% withanolides, 95% curcuminoids — printed on the bottle." },
];

function LifestylePage() {
  return (
    <div className="relative bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      <PageHero
        eyebrow="Lifestyle · Botanical Protocols"
        title={
          <>
            Stacks for the body{" "}
            <em className="not-italic italic text-terra">you intend to build.</em>
          </>
        }
        subtitle="Four curated combinations — engineered for absorption, timed to your circadian rhythm, drawn from the whole apothecary."
        image={lifestyleHero}
        imageAlt="Aranya botanicals overhead flat-lay"
      />

      {/* INTRO STRIP */}
      <div className="border-y border-cream/10 bg-walnut/30">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-center gap-x-10 gap-y-2 px-6 py-3 text-[11px] uppercase tracking-[0.28em] text-cream/70 md:px-10">
          <span>04 protocols</span>
          <span className="hidden md:inline">·</span>
          <span>12 botanicals</span>
          <span className="hidden md:inline">·</span>
          <span>One quiet body</span>
        </div>
      </div>

      {/* PROTOCOLS */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">Choose your intent</span>
            <h2 className="mt-3 max-w-3xl font-display text-4xl md:text-5xl">
              The body remembers <em className="italic text-terra not-italic">what you give it, and when.</em>
            </h2>
          </Reveal>

          <div className="mt-20 space-y-24">
            {protocols.map((p, i) => {
              const Icon = p.icon;
              const reverse = i % 2 === 1;
              return (
                <motion.article
                  key={p.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>div:first-child]:order-2" : ""}`}
                >
                  <div className="relative">
                    <div className={`absolute inset-0 -z-10 rounded-sm bg-gradient-to-br ${p.accent} blur-2xl`} />
                    <div className="overflow-hidden rounded-sm border border-cream/10">
                      <motion.img
                        src={p.image}
                        alt={p.name}
                        loading="lazy"
                        width={1200}
                        height={1500}
                        className="aspect-[4/5] w-full object-cover"
                        whileHover={{ scale: 1.04 }}
                        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.32em] text-sand/70">
                      <Icon className="h-4 w-4 text-terra" />
                      {p.tag}
                    </div>
                    <h3 className="mt-5 font-display text-4xl md:text-5xl">{p.name}</h3>
                    <p className="mt-4 max-w-md text-cream/70">{p.intent}</p>

                    <ol className="mt-8 space-y-4 border-l border-cream/15 pl-6">
                      {p.stack.map((s, idx) => (
                        <motion.li
                          key={s.name}
                          initial={{ opacity: 0, x: -10 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.5, delay: 0.1 + idx * 0.08 }}
                          className="relative"
                        >
                          <span className="absolute -left-[31px] top-1.5 h-2.5 w-2.5 rounded-full bg-sand" />
                          <div className="flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
                            <span className="font-display text-lg text-cream">{s.name}</span>
                            <span className="text-[11px] uppercase tracking-[0.22em] text-sand/80">{s.dose}</span>
                          </div>
                          <span className="mt-1 block text-[12px] text-cream/55">{s.time}</span>
                        </motion.li>
                      ))}
                    </ol>

                    <div className="mt-8 rounded-sm border border-sand/20 bg-walnut/30 p-5">
                      <span className="text-[10px] uppercase tracking-[0.32em] text-sand/70">Absorption note</span>
                      <p className="mt-2 text-[14px] leading-relaxed text-cream/75">{p.absorbedWith}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* ABSORPTION SCIENCE INFOGRAPHIC */}
      <section className="border-t border-cream/8 bg-walnut/25 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">The science of uptake</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">
              A botanical is only <em className="italic text-terra not-italic">as potent as it is absorbed.</em>
            </h2>
          </Reveal>

          <div className="mt-16 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {absorptionPrinciples.map((a, i) => {
              const Icon = a.icon;
              return (
                <Reveal key={a.h} delay={i * 0.08}>
                  <div className="h-full rounded-sm border border-cream/10 bg-umber/40 p-7 transition hover:border-sand/30">
                    <Icon className="h-6 w-6 text-sand" />
                    <h4 className="mt-6 font-display text-xl">{a.h}</h4>
                    <p className="mt-3 text-[14px] leading-relaxed text-cream/65">{a.b}</p>
                  </div>
                </Reveal>
              );
            })}
          </div>

          {/* BIOAVAILABILITY BAR CHART */}
          <Reveal delay={0.2}>
            <div className="mt-20 rounded-sm border border-cream/10 bg-umber/50 p-8 md:p-12">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.32em] text-sand/70">Curcumin bioavailability</span>
                  <h3 className="mt-2 font-display text-2xl md:text-3xl">Why pairing matters.</h3>
                </div>
                <span className="text-[11px] uppercase tracking-[0.22em] text-cream/50">Relative AUC, peer-reviewed</span>
              </div>

              <div className="mt-10 space-y-5">
                {[
                  { label: "Plain turmeric powder", value: 4, note: "1×" },
                  { label: "+ Black pepper (piperine)", value: 80, note: "20×" },
                  { label: "+ Lipid carrier (ghee/milk)", value: 56, note: "14×" },
                  { label: "Aranya stack — pepper + lipid + warm water", value: 100, note: "27×" },
                ].map((r, i) => (
                  <div key={r.label}>
                    <div className="flex items-baseline justify-between text-[12px]">
                      <span className="text-cream/80">{r.label}</span>
                      <span className="font-display text-sand">{r.note}</span>
                    </div>
                    <div className="mt-2 h-2 overflow-hidden rounded-full bg-cream/8">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{ width: `${r.value}%` }}
                        viewport={{ once: true, margin: "-40px" }}
                        transition={{ duration: 1.2, delay: 0.1 + i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                        className="h-full rounded-full bg-gradient-to-r from-terra via-gold to-sand"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* CTA */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto flex max-w-4xl flex-col items-center text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-sand/70">Begin with one</span>
          <h2 className="mt-5 font-display text-4xl md:text-5xl">
            Build your protocol. <em className="italic text-terra not-italic">We'll dose, time and ship it.</em>
          </h2>
          <p className="mt-5 max-w-xl text-cream/65">
            Subscribe to a stack and Aranya delivers a 28-day kit — premeasured sachets, a printed ritual card, and a free body-state consult.
          </p>
          <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link to="/products" className="group inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand">
              Build my stack
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
            <Link to="/contact" className="rounded-full border border-cream/25 px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-cream/85 transition hover:border-sand hover:text-cream">
              Talk to a herbalist
            </Link>
          </div>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
