import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Sun, Moon, Sunrise, Sunset, Droplet, Leaf, Wind, Flame } from "lucide-react";
import { SiteFooter } from "@/components/SiteFooter";
import { PageHero } from "@/components/PageHero";
import { Reveal } from "@/components/Reveal";
import ritualsHero from "@/assets/rituals-hero.jpg";
import awakenImg from "@/assets/ritual-awaken.jpg";
import sustainImg from "@/assets/ritual-sustain.jpg";
import softenImg from "@/assets/ritual-soften.jpg";
import surrenderImg from "@/assets/ritual-surrender.jpg";
import bundleImg from "@/assets/ritual-bundle.jpg";

export const Route = createFileRoute("/rituals")({
  head: () => ({
    meta: [
      { title: "Daily Rituals — Aranya" },
      {
        name: "description",
        content:
          "Four moments. Four botanicals. A guided day-to-night ritual built around your circadian rhythm.",
      },
      { property: "og:title", content: "Aranya — Daily Rituals" },
      { property: "og:description", content: "A botanical companion for every hour of the day." },
    ],
  }),
  component: RitualsPage,
});

const rituals = [
  {
    icon: Sunrise,
    glyph: Droplet,
    time: "06 : 30",
    angle: -90, // top
    name: "Awaken",
    botanical: "Triphala Morning Premix",
    body: "Warm water, half a teaspoon. Restores digestive intelligence before the first thought.",
    notes: ["Empty stomach", "Warm water", "Hold 30s on the tongue"],
    image: awakenImg,
    accent: "terra",
    color: "from-terra/40 to-transparent",
  },
  {
    icon: Sun,
    glyph: Flame,
    time: "11 : 00",
    angle: 0, // right
    name: "Sustain",
    botanical: "Ashwagandha Vitality Oil",
    body: "Three drops in adaptogen tea. Steady the nervous system through the noon climb.",
    notes: ["3 drops", "With warm tea", "Pre-lunch window"],
    image: sustainImg,
    accent: "gold",
    color: "from-gold/40 to-transparent",
  },
  {
    icon: Sunset,
    glyph: Leaf,
    time: "17 : 30",
    angle: 90, // bottom
    name: "Soften",
    botanical: "Tulsi Amber Tonic",
    body: "Sip cool. Meets the day's stress with grace, prepares the breath for evening.",
    notes: ["Cool, not cold", "Slow sips", "Away from screens"],
    image: softenImg,
    accent: "clay",
    color: "from-clay/50 to-transparent",
  },
  {
    icon: Moon,
    glyph: Wind,
    time: "22 : 00",
    angle: 180, // left
    name: "Surrender",
    botanical: "Brahmi Stillness Tablet",
    body: "One tablet before sleep. Quiets the cognitive loop, opens the door to deep rest.",
    notes: ["1 tablet", "30 min pre-sleep", "Dim light only"],
    image: surrenderImg,
    accent: "walnut",
    color: "from-walnut/60 to-transparent",
  },
];

function CircadianDial() {
  const size = 520;
  const r = 200;
  const cx = size / 2;
  const cy = size / 2;
  return (
    <svg viewBox={`0 0 ${size} ${size}`} className="h-full w-full">
      <defs>
        <radialGradient id="dialGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="color-mix(in oklab, var(--terra) 18%, transparent)" />
          <stop offset="60%" stopColor="color-mix(in oklab, var(--terra) 0%, transparent)" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r + 40} fill="url(#dialGlow)" />
      {/* outer ring */}
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="currentColor" strokeOpacity="0.18" strokeWidth="1" />
      <circle cx={cx} cy={cy} r={r - 28} fill="none" stroke="currentColor" strokeOpacity="0.08" strokeWidth="1" strokeDasharray="2 6" />

      {/* arc animation */}
      <motion.circle
        cx={cx}
        cy={cy}
        r={r}
        fill="none"
        stroke="var(--terra)"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeDasharray={2 * Math.PI * r}
        initial={{ strokeDashoffset: 2 * Math.PI * r }}
        whileInView={{ strokeDashoffset: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 2.4, ease: "easeInOut" }}
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${cx}px ${cy}px` }}
      />

      {/* hour ticks */}
      {Array.from({ length: 24 }).map((_, i) => {
        const a = (i / 24) * Math.PI * 2 - Math.PI / 2;
        const x1 = cx + Math.cos(a) * (r + 8);
        const y1 = cy + Math.sin(a) * (r + 8);
        const x2 = cx + Math.cos(a) * (r + (i % 6 === 0 ? 22 : 14));
        const y2 = cy + Math.sin(a) * (r + (i % 6 === 0 ? 22 : 14));
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="currentColor"
            strokeOpacity={i % 6 === 0 ? 0.7 : 0.25}
            strokeWidth="1"
          />
        );
      })}

      {/* hour labels */}
      {[
        { h: "06", a: 0 },
        { h: "12", a: 90 },
        { h: "18", a: 180 },
        { h: "00", a: 270 },
      ].map(({ h, a }) => {
        const rad = ((a - 90) * Math.PI) / 180;
        const x = cx + Math.cos(rad) * (r + 44);
        const y = cy + Math.sin(rad) * (r + 44);
        return (
          <text
            key={h}
            x={x}
            y={y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="fill-current"
            fontFamily="ui-serif, Georgia, serif"
            fontSize="14"
            opacity="0.55"
          >
            {h}
          </text>
        );
      })}

      {/* ritual nodes */}
      {rituals.map((rit, i) => {
        const rad = (rit.angle * Math.PI) / 180;
        const x = cx + Math.cos(rad) * r;
        const y = cy + Math.sin(rad) * r;
        const lx = cx + Math.cos(rad) * (r - 60);
        const ly = cy + Math.sin(rad) * (r - 60);
        return (
          <g key={rit.name}>
            <motion.circle
              cx={x}
              cy={y}
              r="9"
              fill="var(--terra)"
              initial={{ scale: 0, opacity: 0 }}
              whileInView={{ scale: 1, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.18, duration: 0.5 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
            <motion.circle
              cx={x}
              cy={y}
              r="20"
              fill="none"
              stroke="var(--terra)"
              strokeOpacity="0.4"
              initial={{ scale: 0 }}
              whileInView={{ scale: [0, 1.4, 1] }}
              viewport={{ once: true }}
              transition={{ delay: 0.6 + i * 0.18, duration: 1 }}
              style={{ transformOrigin: `${x}px ${y}px` }}
            />
            <text
              x={lx}
              y={ly - 6}
              textAnchor="middle"
              className="fill-current"
              fontFamily="ui-serif, Georgia, serif"
              fontSize="11"
              opacity="0.55"
              letterSpacing="2"
            >
              {rit.time.replace(/\s/g, "")}
            </text>
            <text
              x={lx}
              y={ly + 12}
              textAnchor="middle"
              className="fill-current"
              fontFamily="ui-serif, Georgia, serif"
              fontSize="22"
            >
              {rit.name}
            </text>
          </g>
        );
      })}

      {/* center mark */}
      <text x={cx} y={cy - 8} textAnchor="middle" className="fill-current" fontSize="9" opacity="0.5" letterSpacing="4">
        ARANYA
      </text>
      <text x={cx} y={cy + 14} textAnchor="middle" className="fill-current" fontFamily="ui-serif, Georgia, serif" fontSize="18" opacity="0.85">
        24h cycle
      </text>
    </svg>
  );
}

function RitualsPage() {
  return (
    <div className="relative bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      <PageHero
        eyebrow="Day-to-night ritual"
        title={
          <>
            Four moments.{" "}
            <em className="not-italic italic text-terra">One quiet day.</em>
          </>
        }
        subtitle="A botanical companion for the hinges of your day — when the body asks for help and the wise know to listen."
        image={ritualsHero}
        imageAlt="Morning ritual — golden latte"
      />

      {/* CIRCULAR INFOGRAPHIC */}
      <section className="px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">The circadian dial</span>
            <h2 className="mt-3 font-display text-4xl md:text-5xl">A day, drawn in botanicals.</h2>
            <p className="mt-6 max-w-md text-cream/65">
              Four anchor points placed where the body's chemistry shifts — sunrise digestion, midday cortisol, evening
              softening, and the long pull into sleep. Each ritual is a tiny instrument tuned to that hour.
            </p>
            <div className="mt-10 grid grid-cols-2 gap-x-6 gap-y-5 text-[12px] uppercase tracking-[0.18em] text-cream/55">
              <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-terra" />Sunrise · 06:30</div>
              <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-gold" />Midday · 11:00</div>
              <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-clay" />Dusk · 17:30</div>
              <div className="flex items-center gap-3"><span className="h-2 w-2 rounded-full bg-walnut" />Night · 22:00</div>
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="relative mx-auto aspect-square w-full max-w-[560px] text-cream">
              <CircadianDial />
            </div>
          </Reveal>
        </div>
      </section>

      {/* RITUAL CARDS WITH IMAGES */}
      <section className="border-t border-cream/8 bg-walnut/20 px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-6xl">
          <Reveal>
            <div className="flex items-end justify-between gap-6">
              <div>
                <span className="text-xs uppercase tracking-[0.32em] text-sand/70">Hour by hour</span>
                <h2 className="mt-3 font-display text-4xl md:text-5xl">The four rituals.</h2>
              </div>
              <span className="hidden text-[11px] uppercase tracking-[0.28em] text-cream/45 md:block">
                01 — 04
              </span>
            </div>
          </Reveal>

          <div className="mt-16 space-y-20">
            {rituals.map((r, i) => {
              const Icon = r.icon;
              const Glyph = r.glyph;
              const reverse = i % 2 === 1;
              return (
                <motion.article
                  key={r.name}
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-80px" }}
                  transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                  className={`grid items-center gap-10 md:grid-cols-2 md:gap-16 ${reverse ? "md:[&>*:first-child]:order-2" : ""}`}
                >
                  <div className="relative overflow-hidden rounded-sm">
                    <motion.img
                      src={r.image}
                      alt={`${r.name} ritual — ${r.botanical}`}
                      width={1024}
                      height={1280}
                      loading="lazy"
                      className="aspect-[4/5] w-full object-cover"
                      initial={{ scale: 1.08 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <div className={`pointer-events-none absolute inset-0 bg-gradient-to-tr ${r.color} mix-blend-soft-light`} />
                    <div className="absolute left-5 top-5 flex items-center gap-3 rounded-full bg-umber/70 px-4 py-2 backdrop-blur">
                      <Icon className="h-4 w-4 text-sand" />
                      <span className="font-display text-sm tracking-wide text-sand">{r.time}</span>
                    </div>
                    <div className="absolute bottom-5 right-5 text-[10px] uppercase tracking-[0.32em] text-cream/70">
                      {String(i + 1).padStart(2, "0")} / 04
                    </div>
                  </div>

                  <div>
                    <div className="flex items-center gap-3 text-[11px] uppercase tracking-[0.28em] text-terra/90">
                      <Glyph className="h-4 w-4" /> {r.botanical}
                    </div>
                    <h3 className="mt-4 font-display text-5xl md:text-6xl">{r.name}</h3>
                    <p className="mt-5 max-w-md text-cream/70">{r.body}</p>

                    {/* mini-infographic: dosage stripe */}
                    <div className="mt-8 grid grid-cols-3 gap-3">
                      {r.notes.map((n, k) => (
                        <div
                          key={k}
                          className="rounded-sm border border-cream/10 bg-umber/40 px-3 py-3 text-[10px] uppercase tracking-[0.2em] text-cream/70"
                        >
                          <span className="text-terra/80">{String(k + 1).padStart(2, "0")}</span>
                          <span className="mt-1 block text-cream/85">{n}</span>
                        </div>
                      ))}
                    </div>

                    {/* absorption bar */}
                    <div className="mt-8">
                      <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.28em] text-cream/45">
                        <span>Bioavailability window</span>
                        <span>Peak {r.time}</span>
                      </div>
                      <div className="mt-3 h-[3px] w-full overflow-hidden bg-cream/10">
                        <motion.div
                          initial={{ width: 0 }}
                          whileInView={{ width: ["0%", "92%", "78%"][0] || "82%" }}
                          viewport={{ once: true }}
                          transition={{ duration: 1.4, delay: 0.3 }}
                          className="h-full bg-gradient-to-r from-terra via-gold to-clay"
                          style={{ width: "82%" }}
                        />
                      </div>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        </div>
      </section>

      {/* RITUAL BUNDLE WITH IMAGE */}
      <section className="relative isolate overflow-hidden border-t border-cream/8 bg-umber px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto grid max-w-6xl items-center gap-12 lg:grid-cols-[1.05fr_1fr]">
          <Reveal>
            <div className="relative overflow-hidden rounded-sm">
              <img
                src={bundleImg}
                alt="Aranya Day Cycle Set — linen-bound box of four botanical rituals"
                width={1600}
                height={1024}
                loading="lazy"
                className="aspect-[5/4] w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-umber/60 via-transparent to-transparent" />
              <div className="absolute left-5 bottom-5 rounded-full bg-cream/95 px-4 py-2 text-[10px] uppercase tracking-[0.28em] text-umber">
                Limited edition · 240 boxes
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">The complete ritual</span>
            <h2 className="mt-4 font-display text-4xl md:text-5xl">All four, gifted as one.</h2>
            <p className="mt-5 max-w-md text-cream/65">
              The Day Cycle Set arrives in a single linen-bound box, with a hand-printed ritual guide and a beeswax taper
              for the night practice.
            </p>
            <ul className="mt-8 space-y-3 text-[13px] text-cream/70">
              {[
                "Triphala Morning Premix · 60g",
                "Ashwagandha Vitality Oil · 30ml",
                "Tulsi Amber Tonic · 12 sachets",
                "Brahmi Stillness Tablets · 30 ct",
              ].map((line) => (
                <li key={line} className="flex items-center gap-3 border-b border-cream/8 pb-3">
                  <span className="h-1.5 w-1.5 rounded-full bg-terra" />
                  {line}
                </li>
              ))}
            </ul>
            <div className="mt-8 flex flex-wrap items-baseline gap-4">
              <span className="font-display text-5xl text-sand">₹ 5,490</span>
              <span className="text-cream/40 line-through">₹ 7,790</span>
              <span className="rounded-full bg-terra px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-umber">Save 30%</span>
            </div>
            <Link
              to="/products"
              className="group mt-10 inline-flex items-center gap-3 rounded-full bg-cream px-6 py-3 text-[12px] uppercase tracking-[0.25em] text-umber transition hover:bg-sand"
            >
              Begin the ritual
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </Link>
          </Reveal>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
