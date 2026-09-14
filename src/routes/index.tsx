import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Leaf,
  ShieldCheck,
  Sparkles,
  Sun,
  FlaskConical,
  Truck,
} from "lucide-react";
import { SiteHeader } from "@/components/SiteHeader";
import { SiteFooter } from "@/components/SiteFooter";
import { AranyaMark } from "@/components/AranyaMark";
import heroProducts from "@/assets/hero-products.jpg";
import p1 from "@/assets/product-1.jpg";
import p2 from "@/assets/product-2.jpg";
import p3 from "@/assets/product-3.jpg";
import p4 from "@/assets/product-4.jpg";
import ritualAwaken from "@/assets/ritual-awaken.jpg";
import lifestyleGlow from "@/assets/lifestyle-glow.jpg";
import careImg from "@/assets/care-banner.jpg";
import ingredientsImg from "@/assets/ingredients-hero.jpg";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Aranya — Sacred Botanicals, Certified Pure" },
      {
        name: "description",
        content:
          "Premium Ayurvedic botanicals — powders, premixes, tonics, tablets and gummies. Certified pure, ethically sourced, sacredly crafted.",
      },
      { property: "og:title", content: "Aranya — Sacred Botanicals" },
      { property: "og:description", content: "Premium, certified-pure Ayurvedic botanicals." },
      { property: "og:type", content: "website" },
    ],
  }),
  component: Home,
});

const products = [
  { img: p1, name: "Golden Turmeric Powder", slug: "golden-turmeric", tag: "Wildcrafted Root", price: "₹ 1,240" },
  { img: p2, name: "Ashwagandha Vitality Oil", slug: "ashwagandha-vitality-oil", tag: "Cold-Pressed", price: "₹ 1,890" },
  { img: p3, name: "Triphala Morning Premix", slug: "triphala-morning-premix", tag: "Daily Ritual", price: "₹ 1,460" },
  { img: p4, name: "Tulsi Amber Tonic", slug: "tulsi-amber-tonic", tag: "Adaptogen Beverage", price: "₹ 2,210" },
];

const ingredients = [
  {
    name: "Ashwagandha",
    side: "left",
    body: "Sacred root of resilience. Calms the nervous system and rebuilds vitality at the cellular level.",
  },
  {
    name: "Triphala",
    side: "left",
    body: "The three-fruit harmony. Restores digestive intelligence and gentle daily renewal.",
  },
  {
    name: "Brahmi",
    side: "left",
    body: "Cognitive clarity and stillness of mind. The herb of meditation and quiet focus.",
  },
  {
    name: "Turmeric",
    side: "right",
    body: "The golden root. Pure curcuminoid concentrate — anti-inflammatory at its source.",
  },
  {
    name: "Tulsi",
    side: "right",
    body: "Holy basil, the queen of herbs. An adaptogen that meets stress with grace.",
  },
  {
    name: "Moringa",
    side: "right",
    body: "Complete plant nourishment. Iron, calcium and ninety phytonutrients in a single leaf.",
  },
];

const menuItems = [
  {
    img: p1,
    form: "Powder",
    name: "Golden Turmeric",
    slug: "golden-turmeric",
    note: "Energise Your Day",
    body: "Vibrant and grounding. Stone-ground Lakadong turmeric with 7%+ curcumin and a clean, earthy lift.",
    chips: ["Grounding", "Smooth", "Immunity"],
    price: "₹ 1,240",
  },
  {
    img: p2,
    form: "Oil",
    name: "Ashwagandha Vitality Oil",
    slug: "ashwagandha-vitality-oil",
    note: "Deep Restoration",
    body: "Creamy and restorative. Cold-pressed root infusion for quiet strength and restful evenings.",
    chips: ["Calming", "Adaptogen", "Restorative"],
    price: "₹ 1,890",
  },
  {
    img: p3,
    form: "Premix",
    name: "Triphala Morning Premix",
    slug: "triphala-morning-premix",
    note: "Pure · Balanced · Timeless",
    body: "The classic three-fruit blend, gently dried and milled for daily digestive intelligence.",
    chips: ["Balanced", "Digestive", "Mindful"],
    price: "₹ 1,460",
  },
  {
    img: ritualAwaken,
    form: "Latte",
    name: "Dawn Golden Latte",
    slug: "dawn-golden-latte",
    note: "Gentle Energy",
    body: "Fresh and uplifting. Turmeric, ashwagandha and cinnamon whisked into warm plant milk.",
    chips: ["Uplifting", "Energising", "Revitalising"],
    price: "₹ 980",
  },
  {
    img: p4,
    form: "Tonic",
    name: "Tulsi Amber Tonic",
    slug: "tulsi-amber-tonic",
    note: "Soft Comfort",
    body: "Rich and aromatic. Holy basil steeped slow for warmth, comfort, and quiet moments.",
    chips: ["Aromatic", "Warming", "Comforting"],
    price: "₹ 2,210",
  },
  {
    img: lifestyleGlow,
    form: "Blend",
    name: "Luminous Glow Blend",
    slug: "luminous-glow-blend",
    note: "Pure · Radiant · Timeless",
    body: "A thoughtfully crafted blend of amla, rose and moringa — harmonious balance and a soothing glow.",
    chips: ["Refined", "Radiant", "Mindful"],
    price: "₹ 1,650",
  },
];


const marquee = [
  "Founders' Edition — 30% off",
  "Single-origin Turmeric — New Harvest",
  "Free pan-India dispatch above ₹2,000",
  "Lab-tested batch ·08· now live",
  "Ashwagandha Vitality Oil — Restocked",
  "Gummies & Tablets — Launch offer",
];

const heroBadges = [
  { icon: Leaf, label: "100% Natural" },
  { icon: FlaskConical, label: "Lab Verified" },
  { icon: Truck, label: "Fresh Dispatch" },
];

const heroStrip = [
  { icon: Sun, title: "Sun-dried", sub: "Slow, low-heat cure" },
  { icon: Leaf, title: "Whole plant", sub: "Never extracted" },
  { icon: ShieldCheck, title: "Certified pure", sub: "USDA · India Organic" },
  { icon: Sparkles, title: "Hand-packed", sub: "Small batches" },
];

const ease = [0.22, 1, 0.36, 1] as const;

const heroSlides = [
  { img: heroProducts, name: "Apothecary Edit", caption: "A Ritual of Calm", price: "\u20b9 2,480" },
  { img: p2, name: "Ashwagandha Vitality Oil", caption: "Cold-Pressed Root", price: "\u20b9 1,890" },
  { img: p4, name: "Tulsi Amber Tonic", caption: "Adaptogen Beverage", price: "\u20b9 2,210" },
  { img: ritualAwaken, name: "Awaken Ritual Set", caption: "First Light Blend", price: "\u20b9 3,150" },
];

function Home() {
  const [[slide, dir], setSlide] = useState<[number, number]>([0, 1]);
  const lock = useRef(0);
  const slideRef = useRef(0);
  const showcaseRef = useRef<HTMLDivElement | null>(null);
  const paginate = (d: number) =>
    setSlide(([i]) => {
      const n = Math.min(Math.max(i + d, 0), heroSlides.length - 1);
      slideRef.current = n;
      return [n, d];
    });
  const goTo = (i: number) => {
    slideRef.current = i;
    setSlide(([p]) => [i, i > p ? 1 : -1]);
  };

  // Scroll-driven: hold the page while slides advance, then release scrolling.
  useEffect(() => {
    const el = showcaseRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      const dy = e.deltaY * (e.deltaMode === 1 ? 16 : e.deltaMode === 2 ? 100 : 1);
      if (Math.abs(dy) < 4) return;
      const i = slideRef.current;
      const canAdvance = dy > 0 ? i < heroSlides.length - 1 : i > 0 && window.scrollY <= 2;
      if (!canAdvance) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lock.current < 620) return;
      lock.current = now;
      paginate(dy > 0 ? 1 : -1);
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  const active = heroSlides[slide]!;


  return (
    <div className="relative min-h-screen bg-umber text-cream">
      <div className="bg-grain pointer-events-none fixed inset-0 z-50 opacity-[0.12] mix-blend-overlay" />

      {/* HERO — apothecary menu composition */}
      <section className="relative isolate overflow-hidden">
        <div className="absolute inset-0 -z-10 bg-gradient-to-b from-walnut/50 via-umber to-umber" />
        <div
          className="absolute inset-0 -z-10 opacity-50"
          style={{
            background:
              "radial-gradient(45% 35% at 72% 22%, oklch(0.45 0.10 50 / 0.5), transparent 72%)",
          }}
        />

        <SiteHeader />

        {/* vertical side label */}
        <div className="pointer-events-none absolute right-4 top-28 z-10 hidden flex-col items-center gap-3 lg:flex">
          <AranyaMark size={18} className="text-terra/80" />
          <span className="h-10 w-px bg-cream/15" />
          <span
            className="text-[9px] uppercase tracking-[0.5em] text-cream/40"
            style={{ writingMode: "vertical-rl" }}
          >
            Sacred Bloom
          </span>
        </div>

        {/* offer marquee */}
        <div className="relative z-10 mt-[96px] overflow-hidden border-y border-cream/10 bg-clay/25 py-1.5 backdrop-blur-sm md:mt-[112px]">
          <motion.div
            className="flex w-max gap-10 whitespace-nowrap"
            animate={{ x: ["0%", "-50%"] }}
            transition={{ duration: 30, ease: "linear", repeat: Infinity }}
          >
            {[...marquee, ...marquee].map((m, i) => (
              <span
                key={i}
                className="flex items-center gap-3 text-[10px] uppercase tracking-[0.28em] text-cream/80"
              >
                <Sparkles className="h-3 w-3 text-sand" /> {m}
              </span>
            ))}
          </motion.div>
        </div>

        {/* top band — editorial copy + background-blended product showcase */}
        <div className="mx-auto grid w-full max-w-7xl items-center gap-8 px-6 pb-6 pt-10 md:grid-cols-2 md:gap-10 md:px-10 md:pb-8 md:pt-12">
          <div className="w-full max-w-xl">
            <motion.span
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, ease }}
              className="inline-flex items-center gap-2 rounded-full border border-sand/25 bg-sand/5 px-4 py-1.5 text-[10px] uppercase tracking-[0.32em] text-sand"
            >
              <Leaf className="h-3 w-3" /> Certified Pure · Sacred Bloom
            </motion.span>
            <motion.h1
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.1, ease }}
              className="text-shadow-soft mt-5 font-display text-[clamp(2.2rem,4.2vw,3.7rem)] leading-[1.05]"
            >
              From the Forest,
              <br />
              to Your Ritual —
              <br />
              <em className="italic text-terra">Pure. Proven.</em>
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.22, ease }}
              className="mt-4 max-w-md text-[13px] leading-relaxed text-cream/60"
            >
              Powders, premixes, tonics and gummies — grown on our own
              certified farms, packed in small batches, and traced from soil to
              your shelf.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.32, ease }}
              className="mt-7 flex flex-wrap items-center gap-3"
            >
              <a
                href="/products"
                className="group inline-flex items-center gap-3 rounded-full bg-sand px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-umber transition hover:bg-cream"
              >
                Explore Botanicals
                <ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-1" />
              </a>
              <a
                href="/philosophy"
                className="inline-flex items-center gap-3 rounded-full border border-cream/25 px-6 py-3 text-[11px] uppercase tracking-[0.22em] text-cream transition hover:border-sand hover:text-sand"
              >
                Our Philosophy
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.42, ease }}
              className="mt-8 grid grid-cols-3 gap-3"
            >
              {heroBadges.map((b) => (
                <div key={b.label} className="flex items-center gap-2.5">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-sand/25 bg-sand/5 text-sand">
                    <b.icon className="h-3.5 w-3.5" />
                  </span>
                  <span className="text-[9px] uppercase leading-tight tracking-[0.16em] text-cream/60">
                    {b.label}
                  </span>
                </div>
              ))}
            </motion.div>
          </div>

          {/* right column — blended showcase + category circles */}
          <div className="flex w-full flex-col items-center">
          {/* hero showcase — frameless, blended into the umber backdrop */}
          <motion.div
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1.2, delay: 0.15, ease }}
            ref={showcaseRef}
            className="relative h-[clamp(340px,56svh,560px)] w-full overflow-hidden overscroll-contain"
          >
            {/* warm glow behind the product */}
            <div
              className="pointer-events-none absolute inset-0"
              style={{
                background:
                  "radial-gradient(46% 52% at 50% 46%, oklch(0.50 0.11 52 / 0.45), transparent 74%)",
              }}
            />
            {/* slow rotating dashed halo */}
            <motion.div
              aria-hidden
              animate={{ rotate: 360 }}
              transition={{ duration: 46, repeat: Infinity, ease: "linear" }}
              className="pointer-events-none absolute left-1/2 top-1/2 h-[78%] aspect-square -translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed border-sand/20"
            />

            {/* floating wrapper + scroll-driven transitions */}
            <motion.div
              animate={{ y: [0, -12, 0] }}
              transition={{ duration: 6.5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              <AnimatePresence initial={false} custom={dir} mode="popLayout">
                <motion.img
                  key={slide}
                  custom={dir}
                  src={active.img}
                  alt={active.name}
                  width={1600}
                  height={1024}
                  variants={{
                    enter: (d: number) => ({ opacity: 0, y: d > 0 ? 70 : -70, scale: 1.1, rotate: d > 0 ? 2.5 : -2.5 }),
                    center: { opacity: 1, y: 0, scale: 1, rotate: 0 },
                    exit: (d: number) => ({ opacity: 0, y: d > 0 ? -70 : 70, scale: 1.05, rotate: d > 0 ? -2 : 2 }),
                  }}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.85, ease }}
                  className="absolute inset-0 h-full w-full object-cover [mask-image:radial-gradient(72%_72%_at_50%_46%,black_52%,transparent_98%)]"
                />
              </AnimatePresence>
            </motion.div>


            {/* price + caption rail */}
            <div className="pointer-events-none absolute inset-0 flex flex-col justify-between p-6 md:p-8">
              <div className="flex items-start justify-end">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={active.name}
                    initial={{ opacity: 0, y: 14 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -14 }}
                    transition={{ duration: 0.5, ease }}
                    className="text-right"
                  >
                    <span className="font-display text-3xl text-sand md:text-4xl">
                      {active.price}
                    </span>
                    <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-cream/55">
                      {active.name}
                    </p>
                  </motion.div>
                </AnimatePresence>
              </div>

              <div className="flex items-end justify-between">
                {/* arrows + counter */}
                <div className="pointer-events-auto flex items-center gap-3">
                  <button
                    aria-label="Previous botanical"
                    onClick={() => paginate(-1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/80 transition hover:border-sand hover:bg-cream hover:text-umber"
                  >
                    <ArrowRight className="h-3.5 w-3.5 rotate-180" />
                  </button>
                  <button
                    aria-label="Next botanical"
                    onClick={() => paginate(1)}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-cream/25 text-cream/80 transition hover:border-sand hover:bg-cream hover:text-umber"
                  >
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                  <span className="ml-1 text-[10px] tracking-[0.28em] text-cream/50">
                    {String(slide + 1).padStart(2, "0")} /{" "}
                    {String(heroSlides.length).padStart(2, "0")}
                  </span>
                </div>

                {/* thumbnails */}
                <div className="pointer-events-auto flex items-center gap-2">
                  {heroSlides.map((s, i) => (
                    <button
                      key={s.name}
                      aria-label={s.name}
                      onClick={() => goTo(i)}
                      className={`h-11 w-11 overflow-hidden rounded-full ring-1 transition ${
                        i === slide
                          ? "ring-sand opacity-100 scale-110"
                          : "ring-cream/20 opacity-55 hover:opacity-90"
                      }`}
                    >
                      <img src={s.img} alt="" className="h-full w-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <AnimatePresence mode="wait">
              <motion.span
                key={active.caption}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.5 }}
                className="pointer-events-none absolute bottom-24 left-1/2 -translate-x-1/2 text-[9px] uppercase tracking-[0.34em] text-cream/60"
              >
                {active.caption}
              </motion.span>
            </AnimatePresence>
          </motion.div>
            {/* category circles */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.5, ease }}
              className="mt-6 flex w-full flex-wrap items-start justify-center gap-4 md:gap-6"
            >
              {[
                { img: p1, label: "Powders" },
                { img: p3, label: "Premixes" },
                { img: p2, label: "Oils" },
                { img: p4, label: "Tonics" },
                { img: ritualAwaken, label: "Ritual Sets" },
                { img: lifestyleGlow, label: "Blends" },
              ].map((c, i) => (
                <a
                  key={c.label}
                  href="/products"
                  className="group flex w-[64px] flex-col items-center gap-2"
                >
                  <motion.span
                    initial={{ opacity: 0, scale: 0.7 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.6, delay: 0.55 + i * 0.08, ease }}
                    className={`block h-14 w-14 overflow-hidden rounded-full ring-1 transition duration-300 group-hover:scale-105 md:h-16 md:w-16 ${
                      i === 0
                        ? "ring-2 ring-sand shadow-[0_0_24px_oklch(0.85_0.045_70/0.25)]"
                        : "ring-cream/20 group-hover:ring-sand"
                    }`}
                  >
                    <img
                      src={c.img}
                      alt={c.label}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  </motion.span>
                  <span
                    className={`text-center text-[8.5px] uppercase tracking-[0.16em] transition ${
                      i === 0 ? "text-sand" : "text-cream/55 group-hover:text-cream"
                    }`}
                  >
                    {c.label}
                  </span>
                </a>
              ))}
            </motion.div>
          </div>
        </div>

        {/* certification strip */}
        <div className="border-y border-cream/10 bg-walnut/25">
          <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-8 gap-y-2 px-6 py-3 md:justify-between md:px-10">
            {[
              "Fair For Life",
              "India Organic",
              "USDA Organic",
              "FSSAI Certified",
              "Non-GMO Verified",
              "Lab Tested",
            ].map((c) => (
              <span
                key={c}
                className="flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-cream/55"
              >
                <ShieldCheck className="h-3 w-3 text-terra" /> {c}
              </span>
            ))}
          </div>
        </div>

        {/* apothecary menu grid */}
        <div className="mx-auto w-full max-w-7xl px-6 pb-16 md:px-10">
          <motion.div
            initial={{ opacity: 0, y: 32 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.9, ease }}
            className="overflow-hidden rounded-sm border border-cream/12 bg-gradient-to-b from-walnut/30 to-umber/60 backdrop-blur-sm"
          >
            <div className="grid md:grid-cols-[1fr_3fr]">
              {/* sidebar — category panel */}
              <aside className="flex flex-col justify-between gap-8 border-b border-cream/10 p-6 md:border-b-0 md:border-r md:p-8">
                <div>
                  <span className="flex h-10 w-10 items-center justify-center rounded-full border border-cream/20 text-terra">
                    <Leaf className="h-4 w-4" />
                  </span>
                  <h2 className="mt-4 font-display text-2xl leading-tight text-cream md:text-3xl">
                    Signature
                    <br />
                    Botanicals
                  </h2>
                  <p className="mt-3 max-w-[26ch] text-[12px] leading-relaxed text-cream/55">
                    Carefully crafted whole-plant preparations that balance
                    tradition and modernity.
                  </p>
                  <a
                    href="/products"
                    className="group mt-4 inline-flex items-center gap-3 rounded-full border border-cream/30 px-4 py-2 text-[10px] uppercase tracking-[0.24em] text-cream transition hover:border-sand hover:bg-cream hover:text-umber"
                  >
                    Explore Botanicals
                    <ArrowRight className="h-3 w-3 transition group-hover:translate-x-1" />
                  </a>
                </div>

                {/* origin card */}
                <div className="relative overflow-hidden rounded-sm bg-gradient-to-br from-clay/40 to-walnut/50 p-5">
                  <AranyaMark size={100} className="absolute -right-5 -top-5 text-cream/8" />
                  <span className="text-[9px] uppercase tracking-[0.3em] text-sand/80">
                    From the Nilgiris, India
                  </span>
                  <p className="mt-2 text-[11px] leading-relaxed text-cream/65">
                    Our botanicals are sourced directly from heritage farms —
                    known for their rich soil, pure water, and centuries of
                    plant mastery.
                  </p>
                  <span className="mt-3 flex items-center gap-2 text-[9px] uppercase tracking-[0.24em] text-cream/45">
                    <ShieldCheck className="h-3 w-3 text-terra" /> USDA · India
                    Organic Certified
                  </span>
                </div>
              </aside>

              {/* product cards */}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3">
                {menuItems.map((m, i) => (
                  <Link key={m.name} to="/products/$slug" params={{ slug: m.slug }} className="block">
                    <motion.article
                      initial={{ opacity: 0, y: 24 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true, margin: "-40px" }}
                      transition={{ duration: 0.7, delay: i * 0.07, ease }}
                      className="group flex flex-col border-cream/10 p-5 transition hover:bg-cream/[0.03] sm:border-l sm:[&:nth-child(odd)]:border-l-0 lg:[&:nth-child(odd)]:border-l lg:[&:nth-child(3n+1)]:border-l-0 [&:nth-child(n+2)]:border-t sm:[&:nth-child(-n+2)]:border-t-0 lg:[&:nth-child(-n+3)]:border-t-0 lg:[&:nth-child(n+2)]:border-t"
                    >
                    <div className="relative mx-auto aspect-square w-full max-w-[165px] overflow-hidden rounded-full">
                      <img
                        src={m.img}
                        alt={m.name}
                        loading="lazy"
                        width={768}
                        height={768}
                        className="h-full w-full object-cover transition duration-700 group-hover:scale-110"
                      />
                      <div className="absolute inset-0 rounded-full ring-1 ring-inset ring-cream/15" />
                    </div>

                    <span className="mt-4 w-fit rounded-full border border-cream/20 px-3 py-1 text-[9px] uppercase tracking-[0.22em] text-cream/70">
                      {m.form}
                    </span>
                    <h3 className="mt-2 font-display text-xl leading-tight text-cream">
                      {m.name}
                    </h3>
                    <p className="mt-0.5 font-display text-[12px] italic text-terra/90">
                      {m.note}
                    </p>
                    <p className="mt-2 text-[11px] leading-relaxed text-cream/55">
                      {m.body}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {m.chips.map((c) => (
                        <span
                          key={c}
                          className="rounded-sm bg-cream/8 px-2 py-0.5 text-[9px] uppercase tracking-[0.14em] text-cream/60"
                        >
                          {c}
                        </span>
                      ))}
                    </div>

                    <span className="mt-4 font-display text-lg text-sand">
                      {m.price}
                    </span>
                    </motion.article>
                  </Link>
                ))}
              </div>
            </div>

            {/* bottom feature strip */}
            <div className="grid grid-cols-2 gap-4 border-t border-cream/10 bg-walnut/25 px-6 py-3 md:grid-cols-4 md:px-8">
              {heroStrip.map((s, i) => (
                <motion.div
                  key={s.title}
                  initial={{ opacity: 0, y: 14 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: i * 0.08, ease }}
                  className="flex items-center gap-2.5"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-clay/25 text-sand">
                    <s.icon className="h-3.5 w-3.5" />
                  </span>
                  <span>
                    <span className="block text-[11px] text-cream/90">{s.title}</span>
                    <span className="block text-[9px] uppercase tracking-[0.16em] text-cream/45">
                      {s.sub}
                    </span>
                  </span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>


      {/* BEST SELLERS */}
      <section id="catalog" className="relative px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <div>
              <span className="text-xs uppercase tracking-[0.32em] text-sand/70">
                The Apothecary
              </span>
              <h2 className="mt-4 font-display text-5xl md:text-6xl">Most cherished.</h2>
            </div>
            <a
              href="#"
              className="group inline-flex items-center gap-2 text-[12px] uppercase tracking-[0.25em] text-cream/70 hover:text-cream"
            >
              View all 84 botanicals
              <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
            </a>
          </div>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((p) => (
              <Link key={p.name} to="/products/$slug" params={{ slug: p.slug }} className="block">
                <article className="group overflow-hidden rounded-sm border border-cream/8 bg-walnut/30 transition hover:border-sand/30">
                <div className="relative aspect-[4/5] overflow-hidden bg-umber">
                  <img
                    src={p.img}
                    alt={p.name}
                    loading="lazy"
                    width={768}
                    height={896}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                  <span className="absolute left-4 top-4 rounded-full border border-cream/20 bg-umber/60 px-3 py-1 text-[10px] uppercase tracking-[0.22em] text-cream/80 backdrop-blur">
                    {p.tag}
                  </span>
                </div>
                <div className="flex items-start justify-between gap-4 p-5">
                  <div>
                    <h3 className="font-display text-xl leading-tight">{p.name}</h3>
                    <p className="mt-2 text-[11px] uppercase tracking-[0.22em] text-cream/50">
                      Add to ritual
                    </p>
                  </div>
                  <span className="font-display text-lg text-sand">{p.price}</span>
                </div>
                </article>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* CARE / STORY */}
      <section id="story" className="relative px-6 py-24 md:px-10 md:py-32">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs uppercase tracking-[0.32em] text-sand/70">
            Care inspired by nature
          </span>
          <div className="mt-10 grid gap-10 md:grid-cols-[1.4fr_1fr] md:items-center">
            <div className="relative h-[280px] overflow-hidden rounded-sm md:h-[360px]">
              <img
                src={careImg}
                alt="Hand harvesting turmeric root"
                loading="lazy"
                width={1600}
                height={700}
                className="h-full w-full object-cover"
              />
            </div>
            <div className="space-y-5 text-cream/75">
              <p className="leading-relaxed">
                For four generations, our growers have tended these soils — turning, drying
                and grinding by the rhythm of the sun. Every batch carries the fingerprint
                of a single farm.
              </p>
              <p className="leading-relaxed">
                We never blend across origins. We never extract. What you receive is the
                whole plant, made fine — nothing added, nothing taken away.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* QUOTE */}
      <section className="relative px-6 py-32 md:px-10 md:py-40">
        <div className="mx-auto max-w-5xl text-center">
          <AranyaMark size={56} className="mx-auto text-sand/80" />
          <h2 className="mt-10 font-display text-[clamp(2.4rem,5.5vw,5rem)] leading-[1.05] text-cream">
            Healthy living begins{" "}
            <em className="not-italic italic text-terra">with balance.</em>
            <br />
            <span className="text-sand">Nature</span> already knows the answer.
          </h2>
        </div>
      </section>

      {/* INGREDIENTS */}
      <section className="relative overflow-hidden border-t border-cream/8 bg-walnut/20 px-6 py-28 md:px-10 md:py-36">
        <div className="mx-auto max-w-7xl">
          <div className="mb-20 max-w-2xl">
            <span className="text-xs uppercase tracking-[0.32em] text-sand/70">
              Science-Driven Ingredients
            </span>
            <h2 className="mt-4 font-display text-5xl md:text-6xl">
              Six roots. <em className="not-italic italic text-terra">One philosophy.</em>
            </h2>
            <p className="mt-6 text-cream/70 leading-relaxed">
              A carefully selected lineage of vitamins and botanical compounds — assayed,
              standardized and verified to support health from root to bloom.
            </p>
          </div>

          <div className="relative grid gap-12 md:grid-cols-[1fr_auto_1fr] md:items-center">
            {/* LEFT */}
            <div className="space-y-12 md:text-right">
              {ingredients
                .filter((i) => i.side === "left")
                .map((i) => (
                  <div key={i.name} className="md:pr-6">
                    <div className="mb-2 flex items-center gap-3 md:justify-end">
                      <h4 className="font-display text-2xl text-sand">{i.name}</h4>
                      <span className="h-px w-10 bg-sand/40" />
                    </div>
                    <p className="text-sm leading-relaxed text-cream/65">{i.body}</p>
                  </div>
                ))}
            </div>

            {/* CENTER IMAGE */}
            <div className="relative mx-auto aspect-square w-full max-w-[420px]">
              <img
                src={ingredientsImg}
                alt="Aranya botanical bottle"
                loading="lazy"
                width={1024}
                height={1024}
                className="h-full w-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-walnut/40" />
            </div>

            {/* RIGHT */}
            <div className="space-y-12">
              {ingredients
                .filter((i) => i.side === "right")
                .map((i) => (
                  <div key={i.name} className="md:pl-6">
                    <div className="mb-2 flex items-center gap-3">
                      <span className="h-px w-10 bg-sand/40" />
                      <h4 className="font-display text-2xl text-sand">{i.name}</h4>
                    </div>
                    <p className="text-sm leading-relaxed text-cream/65">{i.body}</p>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* CATEGORIES STRIP */}
      <section className="border-t border-cream/8 px-6 py-24 md:px-10">
        <div className="mx-auto max-w-7xl">
          <span className="text-xs uppercase tracking-[0.32em] text-sand/70">
            The full apothecary
          </span>
          <h2 className="mt-4 font-display text-4xl md:text-5xl">
            Eleven forms. One purity.
          </h2>
          <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-sm border border-cream/10 bg-cream/10 md:grid-cols-4 lg:grid-cols-6">
            {[
              "Powders",
              "Raw Packed",
              "Premixes",
              "Ready Mixes",
              "Pastes",
              "Shreds",
              "Toppings",
              "Slices",
              "Snacks",
              "Beverages",
              "Tablets",
              "Gummies",
            ].map((c) => (
              <div
                key={c}
                className="group flex aspect-square cursor-pointer flex-col items-center justify-center gap-3 bg-umber p-4 text-center transition hover:bg-walnut/60"
              >
                <AranyaMark size={26} className="text-sand/70 transition group-hover:text-sand" />
                <span className="text-[11px] uppercase tracking-[0.22em] text-cream/70 group-hover:text-cream">
                  {c}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="relative isolate overflow-hidden px-6 py-28 md:px-10 md:py-36">
        <div className="absolute inset-0 -z-10 bg-gradient-to-br from-clay/30 via-walnut/40 to-umber" />
        <div className="mx-auto max-w-3xl text-center">
          <span className="text-xs uppercase tracking-[0.32em] text-sand/80">
            Join the inner circle
          </span>
          <h2 className="mt-6 font-display text-4xl md:text-5xl">
            Letters from the forest.
          </h2>
          <p className="mt-5 text-cream/70">
            Quiet dispatches on rituals, harvests and new arrivals — sent only when
            something is worth sending.
          </p>
          <form className="mx-auto mt-10 flex max-w-md gap-2 border-b border-cream/30 pb-2">
            <input
              type="email"
              placeholder="your@address"
              className="flex-1 bg-transparent py-2 text-sm placeholder:text-cream/40 focus:outline-none"
            />
            <button
              type="submit"
              className="text-[12px] uppercase tracking-[0.25em] text-sand transition hover:text-cream"
            >
              Subscribe →
            </button>
          </form>
        </div>
      </section>

      <SiteFooter />
    </div>
  );
}
